export const useUserData = () => {
    // ⭐️ ATENÇÃO: Use as chaves que você definiu no localStorage.setItem
    const userName = localStorage.getItem('nomeUsuario');
    const userRoleRaw = localStorage.getItem('tipoUsuario');

    // Tradução da Role para exibição
    const getTranslatedRole = (role) => {
        const roles = {
            'Admin': 'Administrador',
            'Chefe': 'Chefe',
            'Analista': 'Analista',
        };
        const normalizedRole = role.replace('ROLE_', ''); 
        return roles[normalizedRole] || normalizedRole;
    };

    return {
        userName: userName, 
        userRole: getTranslatedRole(userRoleRaw) 
    };
};