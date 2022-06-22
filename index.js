var http = require('http');
var url = require('url');
var qs = require('querystring');

var db = require("./db");

var port = 8080

http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	// if ( req.method === 'OPTIONSGET' ) {
	// 	res.writeHead(200);
	// 	res.end();
	// 	return;
	// } else if(req.method === 'OPTIONSUPDATE') {
    //     res.writeHead(200);
	// 	res.end();
	// 	return;
    // }
    

    var q = url.parse(req.url, true);
    
    var id = q.query.id;

    res.setHeader('Content-Type', 'application/json');
    
    if(q.pathname == "/scenario" && req.method === "GET"){

    	if(id === undefined){
    		let sql = "SELECT * FROM scenario";

        db.query(sql,(err, result) => {
            if (err) throw err;
            
            res.end(JSON.stringify(result));
            
        });


    	}else if(id > 0){
    		let sql = "SELECT * FROM scenario where id = "+ id;
        
        db.query(sql,(err, result) => {
            if (err) throw err;
            
            var skenario = result[0];

            res.end(JSON.stringify(skenario));
            
        });


    	}
        
    }
    else if(q.pathname == "/scenario" && req.method === "POST"){
    	var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });
    	
    	req.on('end', function () {
            
            var postData = qs.parse(body);

            let skenario = postData.skenario;
            let status = postData.status;
            let waktu = postData.waktu;

            let sql = `insert into scenario (skenario, status, waktu) values ( '${skenario}', '${status}', '${waktu}' )`

			db.query(sql,(err, result) => {
		        if (err) throw err;
			    
			    if(result.affectedRows == 1){
			    	res.end(JSON.stringify({message: 'success'}));	
			    }else{
					res.end(JSON.stringify({message: 'gagal'}));	
			    }
			    
		    });    	
    	
    	});
    	
    }

    else if(q.pathname == "/scenario" && req.method === "PUT"){
    	var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });
    	
    	req.on('end', function () {
            
            var postData = qs.parse(body);

            let skenario = postData.skenario;
            let status = postData.status;
            let waktu = postData.waktu;

            let sql = `UPDATE  scenario set skenario = '${skenario}', status = '${status}', waktu = '${waktu}' where id = ${id}`

			db.query(sql,(err, result) => {
		        if (err) throw err;
			    
			    if(result.affectedRows == 1){
			    	res.end(JSON.stringify({message: 'success'}));	
			    }else{
					res.end(JSON.stringify({message: 'gagal'}));	
			    }
			    
		    });    	
    	
    	});  
    	
    }

    else if(q.pathname == "/scenario" && req.method === "DELETE"){
    	let sql = `DELETE FROM scenario where id = ${id}`

		db.query(sql,(err, result) => {
	        if (err) throw err;
		    
		    if(result.affectedRows == 1){
		    	res.end(JSON.stringify({message: 'success'}));	
		    }else{
				res.end(JSON.stringify({message: 'gagal'}));	
		    }
		    
	    });    	

    }
    
    else if(q.pathname == "/reset" && req.method === "PUT"){
        let sql = `UPDATE  scenario set status = 'Belum dilaksanakan', waktu = '00:00:00.0000'`
        
        db.query(sql,(err, result) => {
            if (err) throw err;
            
            if(result.affectedRows == 5){
                res.end(JSON.stringify({message: 'success'}));	
            }else{
                res.end(JSON.stringify({message: 'gagal'}));	
            }
            
        });
    }
    
    else{

    	res.end();	

    }

  
}).listen(port);

console.log('server is running on http://localhost:'+ port);