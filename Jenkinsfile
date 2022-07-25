import java.text.SimpleDateFormat
import groovy.json.JsonSlurper
import java.io.File 
import groovy.json.JsonOutput

def defDateFormat = new SimpleDateFormat("yyyyMMddHHmm")
def defDate = new Date()
def defTimestamp = defDateFormat.format(defDate).toString()

pipeline {
  agent {label 'Slave_QA2'}


  options {
    skipDefaultCheckout(true)
  }
  
  stages {
    stage('Clean and Checkout SCM') {
      steps {
        cleanWs()
        checkout scm
        bat 'git log -1'
      }
    }

    stage('Build') {
      steps {
	  
	    bat 'npm install express'
		bat 'npm init -y'
        bat 'npm install'
      }
    }

    stage('Pre-Test') {
      steps {
		script {
		
        dir('C:\\Jenkins\\workspace\\Demo_PL_SD_v2\\reporte_rendimiento'){
		try {
		bat 'DEL /F/Q/S *.* > NUL%'
        bat 'rmdir /q/s sbadmin2-1.0.7'
        bat 'rmdir /q/s content'
		}
        			catch (ex) {
        				echo 'No se encontro el archivo...'

        }
        
		}
        dir('C:\\Jenkins\\workspace\\Demo_PL_SD_v2'){
		try {
		bat 'DEL /F/Q/S Rep_Dendimiento.jtl > NUL%'
		}catch (ex) {
        				echo 'No se encontro el archivo...'

        }

          }
		  
		
		}
      }
    }
	
	stage('Test') {
      steps {
	  
		dir('C:\\apache-jmeter-5.3\\bin'){
		//bat 'jmeter -jjmeter.save.saveservice.output_format=xml -n -t D:\\Jenkins\\workspace\\Demo_PL_SD_v2\\SeguriSignLite.jmx -l D:\\Jenkins\\workspace\\Demo_PL_SD_v2\\Rep_Dendimiento.jtl -e -o E:\\reporte_rendimiento -Jjmeterengine.force.system.exit=true' 
		bat 'jmeter -jjmeter.save.saveservice.output_format=xml -n -t C:\\Jenkins\\workspace\\Demo_PL_SD_v2\\SeguriSignLite.jmx -l C:\\Jenkins\\workspace\\Demo_PL_SD_v2\\Rep_Dendimiento.jtl -e -o C:\\Jenkins\\workspace\\Demo_PL_SD_v2\\reporte_rendimiento -Jjmeterengine.force.system.exit=true' 
		
		}
        }
    }

    stage('Report') {
      steps {
		publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: "C:/Jenkins/workspace/Demo_PL_SD_v2/reporte_rendimiento", reportFiles: 'index.html', reportName: 'Reporte de Rendimiento HTML', reportTitles: 'Reporte de Rendimiento HTML'])
		perfReport filterRegex: '', relativeFailedThresholdNegative: 1.2, relativeFailedThresholdPositive: 1.89, relativeUnstableThresholdNegative: 1.8, relativeUnstableThresholdPositive: 1.5, sourceDataFiles: 'Rep_Dendimiento.jtl'

      }
    }
	
	 stage('Extract_Result') {
      steps {
        script {
          try {
			sleep(10)
            bat("echo ${defTimestamp}")
            bat ("echo ${WORKSPACE}")
       //     File fl = new File("${WORKSPACE}/reporte_rendimiento/statistics.json")
			File fl = new File("${WORKSPACE}/reporte_rendimiento/statistics.json")
            //println("\\LAP-RETA\reporte_rendimiento\statistics.json")
            def jsonSlurper = new JsonSlurper()
            def obj = jsonSlurper.parseText(fl.text)
 //         println("Archivo: ${obj}")
          	def json_str = JsonOutput.toJson(obj)
			println("Archivo: ${json_str}")
			//json_str.each { println it }
            echo 'Se extrae Archivo'
         
			def parsedJson = new groovy.json.JsonSlurper().parseText(json_str)
			def porError= 0
			def ids = []
			   if (parsedJson.Total.transaction== "Total") {
				porError= parsedJson.Total.errorPct
			  }
	   			echo 'Total'
				println porError

			
			if(porError>0){
			error('Failed')
			}


          } catch (Exception e) {
         	println("Exception: ${e}")
            echo 'Archivo no existe'
            error('Failed')
          }
        }
      }
    }


  }
}