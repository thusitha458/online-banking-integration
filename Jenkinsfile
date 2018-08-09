pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies'
                sh 'npm install'
                echo 'Finished installing dependencies'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}