
const fs = require('fs');
const http = require("http");
const nodemailer = require('nodemailer');
const html = null;
http.createServer((req, res) => {
	res.writeHead(200, {
	  "Content-type": "text/html"
	});
  
	html = fs.readFileSync(__dirname + "C:/xampp/htdocs/reports/test/index.html", "utf8");
	const user = "Lretamozo";
  
	html = html.replace("{ user }", user);
	res.end(html);
  }).listen(1337, "127.0.0.1");

let index = [];

var fechaPeru = new Date().toLocaleString('en-US', { timeZone: 'America/Lima' });
var fechaHoy = new Date(fechaPeru);
var dia = '';
var mes = '';

if(fechaHoy.getDate()<10){
	dia = '0'+fechaHoy.getDate();
}else{
	dia = ''+fechaHoy.getDate();
}

if(fechaHoy.getMonth()+1<10){
	mes = '0'+(fechaHoy.getMonth()+1);
}else{
	mes = ''+(fechaHoy.getMonth()+1);
}

var fechaReporte = dia+'/'+mes+'/'+fechaHoy.getFullYear();

let message = '';
message = message + '<html><head><style>table, th, td {border: 1px solid black;border-collapse: collapse;}td,tr,th{padding: 5px;}td,tr{vertical-align: center;}td{text-align: center;}.nombre{text-align: left;}.thsup{background-color: #000000;color:white;font-weight: bold;}.thinf{background-color: #D9D9D9;font-weight: bold;}.disclaimer{font-style: italic;color: #C0C0C0}</style></head><body><p>El estado de los tiempos de respuesta de las APIS al día de hoy '+fechaReporte+' es el siguiente:</p><table>'
message = message + '<tr><th class="thsup" colspan="2">Detalle</th><th class="thsup" colspan="3">Tiempos de Respuesta (ms)</th></tr>';
message = message + '<tr><th class="thinf">Paso</th><th class="thinf">API</th><th class="thinf">Media</th><th class="thinf">Minimo</th><th class="thinf">Maximo</th></tr>';


let reporte = html;
//reporte = reporte["aggregate"].customStats;

for (var x in reporte) {
    index.push(x);
}



message = message + '</table><p>Para ver el reporte en detalle debe encontrarse en la red de RIMAC y hacer click en el siguiente enlace:</p><a href="http://10.126.11.27:3000">Reporte de Resultados</a><p>Saludos.</p><p>Squad Cotizacion y Venta<br>RIMAC - Proyecto Royal</p><p class=\"disclaimer\">El presente reporte es autogenerado por el proceso de pruebas de rendimiento, por favor no responder este correo</p></body></html>'

const PropertiesReader = require('properties-reader');
const prop = PropertiesReader('C:/test.properties');

getProperty = (pty) => {return prop.get(pty);}

let transporter = nodemailer.createTransport({
	host: getProperty('AWS_SMTP_HOST'),
	secure: true,
	port: 465,
	auth: {
		user: getProperty('AWS_SMTP_USERNAME'),
		pass: getProperty('AWS_SMTP_PASSWORD')
	},
	tls: {
		rejectUnauthorized: false,
	},
})

var projectName = require('path').dirname(require.main.filename);
projectName = projectName.substring(projectName.lastIndexOf('\\')+1);
if(projectName.includes('_master')){
	projectName = projectName.substring(0,projectName.lastIndexOf('_master'));
}
console.log('projectName');
console.log(projectName);

let archivoDestinatarios = fs.readFileSync(getProperty('JSON_DESTINATARIOS'));
let jsonDestinatarios = JSON.parse(archivoDestinatarios);
var arr = jsonDestinatarios.proyectos[projectName];
var destinatarios = arr.join(",");
console.log(destinatarios);

msg = {
    from: getProperty('AWS_SMTP_SENDER'),
    to: destinatarios,
    subject: 'Pruebas de Rendimiento de APIS al '+fechaReporte,
    html: message
}

transporter.sendMail(msg, function(err, info) {
	if (err) {
		console.log(err)
	} else {
		console.log(info);
	}
})
