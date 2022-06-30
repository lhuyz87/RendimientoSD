import java.text.SimpleDateFormat

def defDateFormat = new SimpleDateFormat("yyyyMMddHHmm")
def defDate = new Date()
def defTimestamp = defDateFormat.format(defDate).toString()

pipeline {
  agent any


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
        bat 'npm install'
      }
    }

    stage('Pre-Test') {
      steps {
		script {
		
        dir('C:\\xampp\\htdocs\\reports\\test'){
		try {
		bat 'DEL /F/Q/S *.* > NUL%'
        bat 'rmdir /q/s sbadmin2-1.0.7'
        bat 'rmdir /q/s content'
		}
        			catch (ex) {
        				echo 'No se encontro el archivo...'

        }
        
		}
        dir('C:\\PROGRA~2\\Jenkins\\workspace\\Demo_Jmeter_PL'){
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
		bat 'jmeter -jjmeter.save.saveservice.output_format=xml -n -t C:\\PROGRA~2\\Jenkins\\workspace\\Demo_Jmeter_PL\\Demo_Prueba_Rendimiento.jmx -l C:\\PROGRA~2\\Jenkins\\workspace\\Demo_Jmeter_PL\\Rep_Dendimiento.jtl -e -o C:\\xampp\\htdocs\\reports\\test'

		}
        }
    }

    stage('Report') {
      steps {
		publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: "C:/xampp/htdocs/reports/test", reportFiles: 'index.html', reportName: 'Reporte de Rendimiento HTML', reportTitles: 'Reporte de Rendimiento HTML'])
		perfReport filterRegex: '', relativeFailedThresholdNegative: 1.2, relativeFailedThresholdPositive: 1.89, relativeUnstableThresholdNegative: 1.8, relativeUnstableThresholdPositive: 1.5, sourceDataFiles: 'Rep_Dendimiento.jtl'

      }
    }

  }
}