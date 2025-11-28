import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output

# Bibliotecas de Dados e Conexão
import pandas as pd
import plotly.express as px
import os 
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import errorcode

# --- 1. CONFIGURAÇÃO E CONEXÃO ---

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, 'coisas.env')) 

DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_NAME = os.environ.get("DB_NAME")

def get_db_connection():
    """Tenta estabelecer a conexão com o banco de dados MySQL."""
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=int(DB_PORT)
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Erro de conexão: {err}")
        return None 

def fetch_data(query):
    """Executa a query e retorna um DataFrame do Pandas."""
    conn = get_db_connection()
    if conn:
        # Nota: Usamos pd.read_sql_query que fecha o cursor internamente.
        df = pd.read_sql_query(query, conn) 
        conn.close()
        return df
    return pd.DataFrame() # Retorna um DataFrame vazio em caso de erro

# --- 2. CONSULTAS SQL ---

MONTHLY_CALLS_QUERY = """
SELECT DATE_FORMAT(Data_Ocorrencia, '%Y-%m') AS mes, COUNT(ID_Ocorrencia) AS total_ocorrencias
FROM ocorrencia
GROUP BY mes
ORDER BY mes;
"""

STATUS_DISTRIBUTION_QUERY = """
SELECT Status_Ocorrencia AS status, COUNT(ID_Ocorrencia) AS contagem
FROM ocorrencia
GROUP BY Status_Ocorrencia;
"""

NATUREZA_DISTRIBUTION_QUERY = """
SELECT Natureza_Ocorrencia AS natureza, COUNT(ID_Ocorrencia) AS contagem
FROM ocorrencia
GROUP BY Natureza_Ocorrencia
ORDER BY contagem DESC
LIMIT 10; -- Limita ao top 10 para melhor visualização
"""

PRIORIDADE_DISTRIBUTION_QUERY = """
SELECT Prioridade_Ocorrencia AS prioridade, COUNT(ID_Ocorrencia) AS contagem
FROM ocorrencia
GROUP BY Prioridade_Ocorrencia
ORDER BY FIELD(Prioridade_Ocorrencia, 'Crítica', 'Alta', 'Média', 'Baixa');
"""

LOCATION_REGRESSION_QUERY = """
SELECT 
    Latitude, 
    Longitude, 
    Localizacao,
    Natureza_Ocorrencia 
FROM 
    ocorrencia
WHERE 
    Latitude IS NOT NULL AND Longitude IS NOT NULL;
"""

# --- 3. INICIALIZAÇÃO E LAYOUT DO DASH ---

# A cor vermelha do bombeiro será usada para destaque e branding
PRIMARY_COLOR = '#E31837' 
# Esta variável não é mais usada, pois o gráfico de Natureza agora usa uma paleta.
CONTRAST_COLOR_GREEN = '#2ca02c' 

app = dash.Dash(__name__)

app.layout = html.Div(children=[
    html.H1(children='🚨 Dashboard de Ocorrências dos Bombeiros', style={'textAlign': 'center', 'color': PRIMARY_COLOR}),
    html.Hr(),

    # Linha 1: Gráfico Mensal (Largura total)
    html.Div(className='row', children=[
        dcc.Graph(
            id='monthly-calls-graph',
            style={'width': '98%', 'margin': '1%'}
        ),
    ]),
    html.Hr(),
    
    # Linha 2: Três Gráficos Lado a Lado (Status, Natureza, Prioridade)
    html.Div(className='row', style={'display': 'flex', 'flex-direction': 'row'}, children=[
        # Gráfico de Status (33% da largura)
        html.Div(children=[
            dcc.Graph(id='status-graph')
        ], style={'width': '33%', 'padding': '10px'}),

        # Gráfico de Natureza (33% da largura)
        html.Div(children=[
            dcc.Graph(id='natureza-graph')
        ], style={'width': '33%', 'padding': '10px'}),

        # Gráfico de Prioridade (33% da largura)
        html.Div(children=[
            dcc.Graph(id='prioridade-graph')
        ], style={'width': '33%', 'padding': '10px'}),
    ]),
    html.Hr(),

    html.Div(children=[
        html.H3("📍 Tendência Geográfica (Regressão Linear)", style={'textAlign': 'center', 'color': '#555'}),
        dcc.Graph(
            id='location-regression-graph',
            style={'width': '98%', 'margin': '1%'}
        )
    ]),
])

# --- 4. CALLBACKS (Lógica que Atualiza os Gráficos) ---

# Callback para Ocorrências Mensais (Gráfico de Barras) - Agora usa paleta Sequencial Viridis
@app.callback(
    Output('monthly-calls-graph', 'figure'),
    [Input('monthly-calls-graph', 'id')]
)
def update_monthly_calls(input_value):
    df_calls = fetch_data(MONTHLY_CALLS_QUERY)
    if df_calls.empty:
        return px.bar(title="Erro ao carregar dados mensais.")

    fig = px.bar(
        df_calls, 
        x='mes', 
        y='total_ocorrencias',
        title='Total de Ocorrências por Mês',
        labels={'total_ocorrencias': 'Chamadas', 'mes': 'Mês/Ano'},
        # Novo: Usa a paleta Viridis para as cores
        color='total_ocorrencias',
        color_continuous_scale=px.colors.sequential.Viridis 
    )
    # Remove a barra de cor que não é necessária em gráficos de barras simples
    fig.update_layout(coloraxis_showscale=False)
    return fig

# Callback para Distribuição por Status (Gráfico de Pizza) - Reverte para Plotly
@app.callback(
    Output('status-graph', 'figure'),
    [Input('status-graph', 'id')]
)
def update_status_distribution(input_value):
    df = fetch_data(STATUS_DISTRIBUTION_QUERY)
    if df.empty:
        return px.pie(title="Erro ao carregar status.")

    fig = px.pie(
        df, 
        names='status', 
        values='contagem', 
        title='Distribuição por Status',
        hole=.3, # Deixa o gráfico em formato Donut
        color_discrete_sequence=px.colors.qualitative.Plotly # Paleta Plotly
    )
    return fig

# Callback para Distribuição por Natureza (Gráfico de Barras Horizontais) - Paleta Qualitativa Plotly
@app.callback(
    Output('natureza-graph', 'figure'),
    [Input('natureza-graph', 'id')]
)
def update_nature_distribution(input_value):
    df = fetch_data(NATUREZA_DISTRIBUTION_QUERY)
    if df.empty:
        return px.bar(title="Erro ao carregar natureza.")
    
    # Inverte a ordem para que a maior contagem fique no topo
    df = df.sort_values('contagem', ascending=True)

    fig = px.bar(
        df, 
        x='contagem', 
        y='natureza', 
        orientation='h',
        title='Top 10 Contagem por Natureza',
        # Usa cor diferente para cada natureza
        color='natureza', 
        color_discrete_sequence=px.colors.qualitative.Plotly,
        labels={'contagem': 'Contagem', 'natureza': 'Natureza da Ocorrência'}
    )
    fig.update_layout(showlegend=False) # Remove a legenda, pois as cores são óbvias pelo eixo Y
    return fig

# Callback para Distribuição por Prioridade (Gráfico de Barras) - Paleta Semântica (Tráfego)
@app.callback(
    Output('prioridade-graph', 'figure'),
    [Input('prioridade-graph', 'id')]
)
def update_prioridade_data(input_value):
    df = fetch_data(PRIORIDADE_DISTRIBUTION_QUERY)
    if df.empty:
        return px.bar(title="Erro ao carregar prioridade.")
    
    # Define a ordem das categorias para o eixo X
    category_order = ['Crítica', 'Alta', 'Média', 'Baixa']

    fig = px.bar(
        df, 
        x='prioridade', 
        y='contagem', 
        title='Ocorrências por Prioridade',
        category_orders={'prioridade': category_order},
        color='prioridade', # Colore as barras pelo valor da prioridade
        color_discrete_map={ # Paleta Semântica (Crítica=Vermelho, Baixa=Verde)
            'Crítica': '#FF0000',
            'Alta': '#FF8C00',
            'Média': '#FFD700',
            'Baixa': '#2E8B57'
        }
    )
    return fig

# Callback para Regressão Linear de Localização - Paleta Dark24
@app.callback(
    Output('location-regression-graph', 'figure'),
    [Input('location-regression-graph', 'id')]
)
def update_location_regression(input_value):
    df = fetch_data(LOCATION_REGRESSION_QUERY)
    
    if df.empty:
        return px.scatter(title="Sem dados de localização (Lat/Long) para gerar regressão.")

    # Converter Lat/Long para números (caso venham como string do banco)
    df['Latitude'] = pd.to_numeric(df['Latitude'])
    df['Longitude'] = pd.to_numeric(df['Longitude'])

    # Criar Gráfico de Dispersão com Linha de Tendência (OLS - Ordinary Least Squares)
    fig = px.scatter(
        df, 
        x='Longitude', 
        y='Latitude',
        color='Natureza_Ocorrencia', # Pinta os pontos baseado na natureza
        color_discrete_sequence=px.colors.qualitative.Dark24, # Paleta Dark24
        hover_name='Localizacao',     # Mostra o endereço ao passar o mouse
        trendline="ols",              # Linha de Regressão Linear
        title='Dispersão Geográfica e Eixo de Tendência (Colorido por Natureza)',
        labels={'Longitude': 'Longitude (X)', 'Latitude': 'Latitude (Y)'},
        trendline_scope="overall"     # Uma única linha de regressão para todos os dados
    )
    
    # Ajustes visuais
    fig.update_layout(
        plot_bgcolor='#f9f9f9',
        height=500
    )
    
    return fig


# --- 5. RODAR O SERVIDOR ---

if __name__ == '__main__':
    # Roda o servidor Dash. Acesse http://127.0.0.1:8050/
    app.run(debug=True)