module.exports = {
	port : 9000,
	asterisk : {
		extension_conf : {
			path : '/etc/asterisk/extensions.conf',
			template : "exten => %username%,1,Dial(SIP/%username%, 15)",
			
			header: "[internal]"
		},
		sip_conf : {
			path : '/etc/asterisk/sip.conf',
			template : "[%username%]\ntype=friend\nhost=dynamic\nsecret=%username%\ncontext=internal",
			header : ""
			
		}
	},
	mongo : {
		uri : 'mongodb://localhost/test'
	}
}