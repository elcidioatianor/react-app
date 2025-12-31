export const errors =  {
	EINTERNAL: 'E701', //500
	ELOGIN: 'E702', //500
	EREGISTER: 'E703', //500
	EREFRESH: 'E704', //500
	ELOGOUT: 'E705', //500
	EACCESS_EXPIRED: 'E800', //401
	EREFRESH_EXPIRED: 'E801', //401
	ENOACCESS: 'E809',
	ENOREFRESH: 'E806', // 401
	ENOCREDENTIALS: 'E802', //401
	EPASSWD_INCORRECT: 'E803', //401: 'Senha incorrecta'
	ENOEXIST: 'E804', //401: 'E-mail inválido'
	EEXIST: 'E805', //409: Email existe
	EREFRESH_INVALID: 'E807', //401
	ESSESSION_INVALID: 'E808'
}

//MOVER PARA O SERVIDOR
export const AUTH_ERROR = {
	[errors.ENOACCESS]: 'Token de acesso não fornecido',
	[errors.EPASSWD_INCORRECT]: 'Senha incorrecta',
	[errors.EEXIST]: 'O e-mail já existe',
	[errors.ENOEXIST]: 'E-mail inválido ou não registado'
}