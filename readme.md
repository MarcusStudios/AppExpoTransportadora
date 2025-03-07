# 🚚 AppExpoTransportadora

## 📋 Descrição
Este projeto é um aplicativo móvel desenvolvido para gerenciar transportadoras utilizando Expo. Ele oferece uma solução completa para o cadastro de transportadoras, gerenciamento de entregas e rastreamento de encomendas de forma eficiente e intuitiva.

## ✨ Funcionalidades
- **📝 Cadastro de transportadoras:** Permite o registro de novas transportadoras no sistema com dados completos
- **📦 Gerenciamento de entregas:** Facilita o controle e a organização das entregas realizadas
- **🔍 Rastreamento de encomendas:** Oferece a possibilidade de rastrear encomendas em tempo real
- **👤 Gestão de usuários:** Sistema completo de autenticação e perfis de usuário
- **👷 Cadastro de empregados:** Gerenciamento de colaboradores da transportadora

## 🛠️ Tecnologias Utilizadas
- **⚛️ React Native:** Framework para desenvolvimento de aplicativos móveis multiplataforma
- **📱 Expo:** Plataforma para desenvolvimento e deploy simplificado de aplicativos React Native
- **🔥 Firebase:** Plataforma para desenvolvimento de aplicativos web e móveis, utilizada para:
  - 🔐 Autenticação de usuários
  - 💾 Banco de dados em tempo real
  - 🗄️ Armazenamento de arquivos

## 🗂️ Estrutura do Projeto
```
AppExpoTransportadora/
├── .gitignore
├── App.js                   # Arquivo principal da aplicação
├── app.json                 # Configurações do Expo
├── babel.config.js          # Configurações do Babel
├── eas.json                 # Configurações do EAS (Expo Application Services)
├── metro.config.js          # Configurações do Metro Bundler
├── package.json             # Dependências do projeto
├── prettier.config.js       # Configurações do Prettier
├── readme.md                # Documentação do projeto
├── .vscode/                 # Configurações do VS Code
│   ├── settings.json
│   └── .react/
├── assets/                  # Recursos estáticos gerais
│   ├── favicon.png
│   ├── icon.png
│   └── splash.png
└── src/                     # Código fonte da aplicação
    ├── Info.plist
    ├── asset/               # Recursos específicos da aplicação
    │   ├── logo.png
    │   └── fonts/
    │       └── JetBrainsMono-Bold.ttf
    ├── pages/               # Páginas da aplicação
    │   ├── cadastro/        # Página de cadastro de transportadoras
    │   │   └── index.js
    │   ├── empregado/       # Página de gestão de empregados
    │   │   └── index.js
    │   ├── home/            # Página principal
    │   │   └── index.js
    │   ├── produto/         # Página de gestão de produtos/encomendas
    │   │   └── index.js
    │   ├── senha/           # Página de recuperação/alteração de senha
    │   │   └── index.js
    │   ├── signin/          # Página de login
    │   │   └── index.js
    │   ├── usuario/         # Página de gestão de usuários
    │   │   └── index.js
    │   └── welcome/         # Página de boas-vindas
    │       └── index.js
    ├── routes/              # Configuração de rotas da aplicação
    │   └── index.js
    └── services/            # Serviços externos
        └── firebaseConfig.js # Configuração do Firebase
```

## 🚀 Como iniciar

### Pré-requisitos
- Node.js instalado
- Expo CLI instalado (`npm install -g expo-cli`)
- Conta no Firebase (para recursos de backend)

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/AppExpoTransportadora.git
   cd AppExpoTransportadora
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Adicione um aplicativo web ao seu projeto Firebase
   - Copie as credenciais de configuração
   - Atualize o arquivo `src/services/firebaseConfig.js` com suas credenciais

4. Inicie o aplicativo:
   ```bash
   npm start
   ```

## 📱 Testes
- Utilize o aplicativo Expo Go em seu dispositivo para testar o aplicativo
- Ou utilize emuladores Android/iOS para desenvolvimento

## 📄 Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📞 Contato
Para mais informações, entre em contato através de [marcuseduardo846@gmail.com]