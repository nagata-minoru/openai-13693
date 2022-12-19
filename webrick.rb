require 'webrick'


srv = WEBrick::HTTPServer.new({ :DocumentRoot => './',
	:BindAddress => '127.0.0.1',
	:Port => 8080,
	SSLEnable: true,
	# SSLCertName: [['CN', WEBrick::Utils.getservername]]}) # ローカルマシン上で実行する場合 [['CN', 'localhost']] でも可
	SSLCertName: [['CN', 'localhost']]}) # ローカルマシン上で実行する場合  でも可
srv.mount_proc('/') { |req, res|
# r = Hash[URI.decode_www_form(req.request_uri.query)]
# res.body = r.inspect
}
trap("INT"){ srv.shutdown }
srv.start
