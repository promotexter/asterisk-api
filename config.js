module.exports = {
	port : 9000,
	asterisk : {
		extension_conf : {
			path : '/etc/asterisk/extensions.conf',
			template : "exten => %username%,1,Dial(SIP/%username%, 15, r)",
			header: "[internal]"
		},
		sip_conf : {
			path : '/etc/asterisk/sip.conf',
			template : "[%username%]\ntype=friend\nhost=dynamic\nsecret=%username%\ncontext=internal",
			header: "[general]\ndisallow=all\nallow=ulaw\nallow=gsm\nprematuremedia=no\nprogressinband=yes\nsilencesuppression=no"
			
		},
		manager: {
			host: '127.0.0.1',
			port: 5038,
			username: 'erwin',
			password: 'atuli'
		}
		
	},
	mongo : {
		uri : 'mongodb://localhost/test'
	}
}
