pipeline {
    agent any

    tools {
        maven 'Maven3'
        jdk 'JDK21'
    }

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        DB_PASSWORD = credentials('db-password')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Njat0Yves/gestion-etudiants.git'
            }
        }

        stage('Build') {
            steps {
                bat 'mvn clean compile'
            }
        }

        stage('Tests unitaires') {
            steps {
                bat 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Analyse qualité (SonarQube)') {
            steps {
                withSonarQubeEnv('SonarQube-Local') {
                    bat 'mvn sonar:sonar -Dsonar.token=%SONAR_TOKEN%'
                }
            }
        }

        stage('Package') {
            steps {
                bat 'mvn package -DskipTests'
            }
        }

        stage('Déploiement sur Nexus') {
            steps {
                bat 'mvn deploy -DskipTests'
            }
        }

        stage('Déploiement application') {
            steps {
                bat '''
                    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8090 ^| findstr LISTENING') do taskkill /F /PID %%a
                    timeout /t 2
                    copy /Y target\\demo-0.0.1-SNAPSHOT.jar C:\\Deploy\\gestion-etudiants\\app.jar
                    start "GestionEtudiants" /D C:\\Deploy\\gestion-etudiants cmd /c "set DB_PASSWORD=%DB_PASSWORD% && java -jar app.jar > logs\\out.log 2> logs\\err.log"
                '''
            }
        }
    }

    post {
        success {
            mail to: 'njatorahery26@gmail.com',
                 subject: "✅ Pipeline réussie : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Le déploiement de Gestion des Étudiants a réussi.\nConsulter : ${env.BUILD_URL}"
        }
        failure {
            mail to: 'njatorahery26@gmail.com',
                 subject: "❌ Pipeline échouée : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Le pipeline a échoué.\nConsulter les logs : ${env.BUILD_URL}console"
        }
    }
}