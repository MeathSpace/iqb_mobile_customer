export default {
  index: {
    header: "Bem-vindo ao IQBook",
    subheader:
      "Agende instantaneamente, estilize seu cabelo e bigode do jeito que você quer com o profissional de sua preferência.",
    registerButtonText: "Cadastrar-se",
    loginButtonText: "Entrar",
  },

  LanguageDropdown: {
    english: "Inglês",
    german: "Alemão",
    portugese: "Português",
  },

  auth: {
    signin: {
      email: {
        label: "E-mail",
        placeholder: "Digite seu e-mail",
      },
      password: {
        label: "Senha",
        placeholder: "Digite sua senha",
      },
      rememberMe: "Lembrar de mim",
      forgotPassword: "Esqueceu a senha?",
      signIn: "Entrar",
      signInWithApple: "Entrar com a Apple",
      signInWithGoogle: "Entrar com o Google",
      dontHaveAccount: "Não tem uma conta?",
      or: "ou",
      signup: "Cadastrar-se",

      errorStatesAndApi: {
        emailRequired: "O e-mail é obrigatório",
        invalidEmailFormat: "Formato de e-mail inválido",
        passwordRequired: "A senha é obrigatória",
        passwordLeastCharecter: "A senha deve ter pelo menos 8 caracteres",
        passwordMostCharecter: "A senha deve ter no máximo 20 caracteres",
        appleSigninFailed: "Falha ao entrar com a Apple, tente novamente.",
      },
    },
    signup: {
      email: { label: "E-mail", placeholder: "Digite seu e-mail" },
      password: { label: "Senha", placeholder: "Digite sua senha" },
      signUp: "Cadastrar-se",
      signUpWithApple: "Cadastrar-se com a Apple",
      signUpWithGoogle: "Cadastrar-se com o Google",
      alreadyMember: "Já é um membro?",
      or: "ou",
      logIn: "Entrar",

      errorStatesAndApi: {
        emailRequired: "O e-mail é obrigatório",
        invalidEmailFormat: "Formato de e-mail inválido",
        passwordRequired: "A senha é obrigatória",
        passwordLeastCharecter: "A senha deve ter pelo menos 8 caracteres",
        passwordMostCharecter: "A senha deve ter no máximo 20 caracteres",
        retreiveEmailError: "Não conseguimos recuperar seu e-mail da Apple",
      },
    },
    forgotPassword: {
      header: "Qual é o seu e-mail?",
      subHeader: "Digite seu endereço de e-mail para redefinir sua senha.",
      email: { label: "E-mail", placeholder: "Digite seu e-mail" },
      continue: "Continuar",

      errorStatesAndApi: {
        emailRequired: "O e-mail é obrigatório",
        invalidEmailFormat: "Formato de e-mail inválido",
        forgetPasswordError: "Erro ao esquecer a senha",
      },
    },
    passwordVerification: {
      header: "Tudo pronto!",
      subHeader:
        "Insira o código de 4 dígitos enviado para o seu número de celular e e-mail",
      verificationCode: {
        label: "Código de Verificação",
        placeholder: "Digite seu OTP",
      },
      verifyAndContinue: "Verificar e Continuar",
      didntReceiveCode: "Não recebeu o código?",
      resend: "Reenviar",
      waitMessage: "Aguarde {{time}}s",

      errorStatesAndApi: {
        waitRequestCode: "Por favor, aguarde antes de solicitar outro código.",
        resendVerifyCode: "Reenviar código de verificação",
        verificationOtpError: "Erro no OTP de verificação",
        verificationCodeRequired: "O código de verificação é obrigatório",
        verificationCodeNotMatched: "O código de verificação não confere",
      },
    },

    // I forget to do this page
    forgetPasswordConfirmation: {
      header: "Tudo pronto!",
      subHeader: "Defina sua senha para entrar.",
      passwordInput: {
        label: "Senha",
        placeholder: "Digite sua senha",
      },
      confirmPasswordInput: {
        label: "Confirmar senha",
        placeholder: "Confirme a sua senha",
      },
      reset: "Redefinir",
      errorStatesAndApi: {
        passwordRequired: "A senha é obrigatória",
        passwordLeastCharecter: "A senha deve ter pelo menos 8 caracteres",
        passwordMostCharecter: "A senha deve ter no máximo 20 caracteres",
        confirmPasswordRequired: "A confirmação de senha é obrigatória",
        passwordsNotMatch: "As senhas não coincidem",
      },
    },

    personalInfo: {
      header: "É hora de criar um perfil!",
      subHeader: "Conte-nos um pouco mais sobre você",
      fullname: {
        label: "Nome Completo",
        placeholder: "Digite seu nome completo",
      },
      gender: {
        label: "Gênero",
        male: "Masculino",
        female: "Feminino",
        other: "Outro",
      },
      mobileNumber: {
        label: "Número de Celular",
      },
      dateOfBirth: {
        label: "Data de Nascimento (Opcional)",
        placeholder: "DD/MM/AA",
      },
      modal: {
        closeText: "fechar",
        openText: "abrir",
      },
      saveAndNext: "Salvar e Avançar",

      errorStatesAndApi: {
        invalidPhoneNumber: "Número de telefone inválido",
        fullNameRequired: "O nome completo é obrigatório",
        fullNameLeastCharecter:
          "O nome completo deve ter pelo menos 2 caracteres",
        fullNameMostCharecter:
          "O nome completo deve ter no máximo 20 caracteres",
        phoneNumberRequired: "O número de telefone é obrigatório",
      },

      alertBox: {
        alertOne: {
          header: "Confirmar",
          subHeader:
            "Se você voltar agora, seu progresso de cadastro será perdido. Tem certeza de que deseja sair?",
          cancel: "Cancelar",
          ok: "Ok",
        },
      },
    },
    verification: {
      header: "Tudo pronto!",
      subHeader:
        "Insira o código de 4 dígitos enviado para o seu número de celular e e-mail",
      verificationCode: {
        label: "Código de Verificação",
        placeholder: "Digite seu OTP",
      },
      verifyAndCreate: "Verificar e Criar Conta",
      didntReceiveCode: "Não recebeu o código?",
      resend: "Reenviar",
      waitMessage: "Aguarde {{time}}s",
      errorStatesAndApi: {
        verificationCodeRequired: "O código de verificação é obrigatório",
        verificationCodeNotMatch: "O código de verificação não confere",
        coolDownRequired: "Por favor, aguarde antes de solicitar outro código.",
        resendVerificationCode: "Reenviar código de verificação",
        verificationOtpError: "Erro no OTP de verificação",
      },
    },
  },

  protected: {
    tabs: {
      home: "Início",
      qlist: "Fila virtual", // Or "Qlist" if it's a specific brand feature name
      salon: "Salão",
      appointment: "Agendamento",
      profile: "Perfil",
    },
    searchHeader: {
      placeholder: "Buscar cidade ou nome do salão",
    },
    map: {
      connect: "Conectar-se",
      close: "Fechar",
      description: "Descrição",
      contactUs: "Contate-nos",
      anyQuestion: "Se você tiver alguma dúvida",
      location: "Localização",
      followUs: "Siga-nos em",
      socialLinks: "Redes sociais",
      exploreAll: "Explorar tudo",
      NoTabAvailable: "Nenhum(a) {{selectedTab}} disponível",
      details: "Detalhes",
      services: "Serviços",
      barbers: "Barbeiros",
      stylists: "Estilistas",
      permissionDeniedError: "Permissão negada",

      alertBox: {
        alertOne: {
          header: "Permissão Negada",
          subHeader:
            "O acesso à localização é necessário para mostrar sua posição.",
        },
        alertTwo: {
          header: "Sucesso",
          subHeader: "Adicionado aos favoritos com sucesso",
          error: {
            header: "Erro",
            subHeader: "Algo deu errado",
          },
        },
      },
    },
    customTabView: {
      header: "Navegar pelos Salões",
      subHeader: "No momento, você não está conectado a nenhum salão",
      buttonText: "Conectar Agora",
    },
    profile: {
      heading: "Perfil",
      options: {
        favorites: "Favoritos",
        changeSalon: "Mudar de Salão",
        helpAndSupport: "Ajuda e Suporte",
        about: "Sobre",
        deleteAccount: {
          header: "Excluir Conta",
          alert: {
            header: "Excluir Conta",
            subHeader:
              "Tem certeza de que deseja excluir permanentemente sua conta?",
            cancel: "Cancelar",
            delete: "Excluir",
          },
        },
        logout: "Sair",
      },

      language: {
        header: "Idioma",
        english: "Inglês",
        german: "Alemão",
        portugese: "Português",
      },
    },
    editProfile: {
      header: "Gerenciar Conta",
      fullname: {
        label: "Nome Completo",
        placeholder: "Digite seu nome completo",
      },
      gender: {
        label: "Gênero",
        male: "Masculino",
        female: "Feminino",
        other: "Outro",
      },
      mobileNumber: {
        label: "Número de Celular",
      },
      dateOfBirth: {
        label: "Data de Nascimento (Opcional)",
        placeholder: "DD/MM/AA",
      },
      modal: {
        closeText: "fechar",
        openText: "abrir",
      },
      editAndSave: "Editar e Salvar",

      errorStatesAndApi: {
        invalidPhoneNumber: "Número de telefone inválido",
        fullNameRequired: "O nome completo é obrigatório",
        fullNameLeastCharecter:
          "O nome completo deve ter pelo menos 2 caracteres",
        fullNameMostCharecter:
          "O nome completo deve ter no máximo 20 caracteres",
        phoneNumberRequired: "O número de telefone é obrigatório",
        dateOfBirthRequired: "A data de nascimento é obrigatória",
      },

      profileUpdateSuccess: "Perfil atualizado com sucesso",
      pickImageAlertGranted:
        "Desculpe, precisamos de permissão para acessar a galeria de mídia para que isso funcione!",
      mimeNotInclude:
        "Tipo de arquivo inválido. Apenas imagens Webp, JPEG, JPG e PNG são permitidas",
      imageUploadSuccess: "Imagem enviada com sucesso",
    },
    connectSalon: {
      header: "Tem certeza de que deseja se desconectar?",
      changeSalon: "Mudar de Salão",
      alertBox: {
        header: "Aviso",
        ok: "OK",
      },
    },

    myFavourites: {
      header: "Meus Favoritos",
      error: {
        header: "Nenhum Favorito",
        subHeader: "Você não tem nenhum salão favorito",
      },
      alertBox: {
        header: "Remover Salão Favorito",
        subHeader:
          "Tem certeza de que deseja remover este salão dos seus favoritos?",
        cancel: "Cancelar",
        remove: "Sim, Remover",
      },
      somethingWentWrong: "Algo deu errado",
    },
    helpAndSupport: {
      header: "Ajuda e Suporte",
      subHeader:
        "Se você estiver enfrentando algum problema, por favor nos avise. Nós tentaremos resolvê-lo o mais rápido possível.",
      title: {
        placeholder: "Título",
      },
      body: {
        placeholder: "Explique o problema",
      },
      submit: "Enviar",
      emailUs: "Envie-nos um e-mail:",
      email: "support@iqbook.io",

      errorStatesAndApi: {
        subjectRequired: "O assunto é obrigatório",
        bodyRequired: "A descrição do problema é obrigatória",
      },

      alertBox: {
        header: "Sucesso",
        subHeader: "O e-mail foi enviado com sucesso ao administrador.",
        ok: "Ok",
        error: {
          header: "Erro",
          subHeader: "Algo deu errado. Por favor, tente novamente mais tarde.",
        },
      },
    },
    about: {
      index: {
        header: "Sobre",
        options: {
          iqbookWebsite: "Site do iqBook",
          termsOfService: "Termos de Serviço",
          privacyPolicy: "Política de Privacidade",
          licenses: "Licenças",
        },
        version: "Versão",
      },
      termService: {
        header: "Termos de Serviço",

        content: {
          mainHeader: "Bem-vindo ao nosso aplicativo de salão!",
          intro: "Ao usar este aplicativo, você concorda com os termos abaixo.",

          sections: {
            usingApp: {
              title: "1. Uso do Nosso Aplicativo",
              points: [
                "Agende atendimentos com antecedência",
                "Entre na fila presencial (individual ou em grupo)",
                "Acompanhe o status do seu agendamento ou da fila em tempo real",
              ],
              footer:
                "Use o aplicativo de forma responsável e siga todas as regras do salão.",
            },

            bookingsQueue: {
              title: "2. Agendamentos e Fila",
              points: [
                "Escolha seu serviço, data e horário para agendar",
                "Entre na fila como um cliente individual ou com um grupo",
                "Os tempos de espera estimados podem mudar de acordo com o fluxo do salão",
              ],
            },

            responsibility: {
              title: "3. Sua Responsabilidade",
              points: [
                "Forneça informações corretas ao agendar ou entrar na fila",
                "Compareça no horário correto para os agendamentos ou para a sua vez na fila",
                "Não comparecimentos repetidos podem levar a restrições",
              ],
            },

            cancellations: {
              title: "4. Cancelamentos",
              points: [
                "Você pode cancelar ou reagendar antes do seu horário",
                "Para grupos, cancele se não for comparecer para evitar atrasos",
              ],
            },

            privacy: {
              title: "5. Sua Privacidade",
              descriptionBefore:
                "Nós protegemos seus dados pessoais e nunca os compartilhamos sem consentimento. Veja nossa ",
              linkText: "Política de Privacidade",
              descriptionAfter: " para saber mais.",
            },

            updates: {
              title: "6. Atualizações",
              description:
                "Os termos podem mudar. Continue usando o aplicativo apenas se concordar com a versão mais recente.",
            },

            help: {
              title: "7. Precisa de Ajuda?",
              description:
                "Contate-nos a qualquer momento pelo aplicativo ou pelo e-mail info@iqbook.io",
            },
          },
        },
      },
      privacyPolicy: {
        header: "Política de Privacidade",

        content: {
          intro1:
            "Obrigado por escolher fazer parte da nossa comunidade no Iqbook. Estamos comprometidos em proteger suas informações pessoais e seu direito à privacidade.",

          intro2_before:
            "Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso ",
          intro2_highlight: "aplicativo móvel de salão",
          intro2_after:
            ", incluindo recursos como agendamento de horários, gerenciamento de filas (individual ou em grupo), notificações e gerenciamento de perfil de usuário.",

          intro3:
            "Ao usar o aplicativo, você concorda com os termos descritos nesta política.",

          sections: {
            infoCollection: {
              title: "1. Informações que Coletamos",
              description:
                "Podemos coletar as seguintes informações quando você usa nosso aplicativo:",

              personal: {
                title: "a) Informações Pessoais",
                points: [
                  "Nome",
                  "Número de telefone",
                  "Endereço de e-mail (opcional)",
                  "Gênero (opcional para personalização do serviço)",
                  "Foto de perfil (opcional)",
                ],
              },

              booking: {
                title: "b) Detalhes de Agendamento e Fila",
                points: [
                  "Serviços selecionados",
                  "Data e hora do agendamento",
                  "Tipo de fila (Individual ou em Grupo)",
                  "Número de pessoas em um grupo",
                ],
              },

              device: {
                title: "c) Dados de Dispositivo e Uso",
                points: [
                  "Tipo de dispositivo (Android/iOS)",
                  "Endereço IP e localização geral",
                  "Estatísticas de uso do aplicativo",
                  "Logs de erros e falhas (crash logs)",
                ],
              },
            },

            usage: {
              title: "2. Como Usamos Suas Informações",
              points: [
                "Agendar e gerenciar seus horários",
                "Permitir que você entre na fila ao vivo (individual/grupo)",
                "Enviar notificações e lembretes em tempo real",
                "Fornecer tempos de espera estimados e posição na fila",
                "Melhorar o desempenho do aplicativo e a experiência do usuário",
                "Responder a solicitações de suporte ou dúvidas",
              ],
              note_before: "Nós ",
              note_highlight: "não",
              note_after:
                " usamos seus dados para fins publicitários e não vendemos suas informações para terceiros.",
            },

            sharing: {
              title: "3. Compartilhamento de Informações",
              points: [
                {
                  bold: "Com a equipe do salão",
                  text: " para gerenciar agendamentos e filas",
                },
                {
                  bold: "Com prestadores de serviços",
                  text: " (por exemplo, provedores de SMS) apenas para enviar mensagens ou suporte técnico",
                },
                {
                  bold: "Quando exigido por lei",
                  text: " para cumprir obrigações legais ou proteger os direitos dos nossos usuários",
                },
              ],
              footer:
                "Garantimos que todos os terceiros sigam padrões rigorosos de confidencialidade e proteção de dados.",
            },

            security: {
              title: "4. Segurança dos Dados",
              points: [
                "Servidores seguros e conexões criptografadas",
                "Controle de acesso baseado em funções para a equipe",
                "Atualizações regulares do aplicativo para corrigir vulnerabilidades de segurança",
              ],
              footer:
                "No entanto, nenhum aplicativo móvel é 100% seguro. Use o aplicativo de forma responsável e atualize-o regularmente.",
            },

            rights: {
              title: "5. Seus Direitos e Escolhas",
              points: [
                "Visualizar e atualizar as informações do seu perfil",
                "Cancelar seus agendamentos ou remover-se da fila",
                "Solicitar a exclusão da sua conta e dos seus dados pessoais",
                "Contatar-nos se acreditar que seus dados foram mal utilizados",
              ],
              contact_before:
                "To update or delete your data, please contact us at ", // Kept as original text fallback, feel free to update to: "Para atualizar ou excluir seus dados, entre em contato conosco em "
              contact_highlight: "[Your Support Email]",
              contact_after:
                " ou use as configurações de perfil no aplicativo.",
            },

            children: {
              title: "6. Privacidade de Crianças",
              description:
                "Nosso aplicativo é voltado para usuários com 13 anos ou mais. Não coletamos intencionalmente dados de crianças menores de 13 anos. Se você acredita que dados de uma criança foram enviados, entre em contato conosco imediatamente para remoção.",
            },

            updates: {
              title: "7. Alterações nesta Política",
              points: [
                "Podemos atualizar esta Política de Privacidade de tempos em tempos para refletir mudanças na tecnologia, na lei ou nas operações comerciais.",
                "Notificaremos os usuários sobre mudanças significativas através do aplicativo",
                "O uso continuado do aplicativo significa que você aceita a política atualizada",
              ],
            },
          },
        },
      },
      licenses: {
        header: "Contrato de Licença de Usuário Final",

        content: {
          effectiveDate_label: "Data de Vigência:",
          effectiveDate_value: "04-07-2025",

          appName_label: "Nome do App:",
          appName_value: "iqbook",

          intro1:
            "Este Contrato de Licença de Usuário Final (“Contrato”) é um acordo legal entre você (“Usuário”, “você” ou “seu”) e o ",
          intro1_highlight: "iqbook",
          intro1_after: ", que rege o uso do aplicativo móvel ",
          intro1_app_highlight: "iqbook",
          intro1_end: " (“App”).",

          intro2:
            "Ao baixar, instalar ou usar o aplicativo, você concorda em ficar vinculado aos termos desta licença.",

          sections: {
            licenseGrant: {
              title: "1. Concessão de Licença",
              allowPoints: [
                "Baixar e instalar o aplicativo em seu dispositivo pessoal",
                "Usar o aplicativo exclusivamente para agendar horários, entrar na fila do salão e gerenciar suas visitas ao salão",
              ],
              restrictionText: "Você não pode:",
              restrictPoints: [
                "Copiar, modificar ou distribuir o aplicativo ou seu conteúdo",
                "Fazer engenharia reversa, decompilar ou tentar extrair o código-fonte",
                "Usar o aplicativo para fins ilegais ou fora do escopo do uso permitido",
              ],
            },

            ownership: {
              title: "2. Propriedade e Propriedade Intelectual",
              description_before:
                "Todo o conteúdo, design, código e marcas registradas dentro do aplicativo são de propriedade do ",
              highlight: "iqbook",
              description_after:
                " ou de seus licenciadores. Esta licença não concede a você a propriedade do aplicativo ou de seu conteúdo — apenas o direito de usá-lo sob as condições deste Contrato.",
            },

            updates: {
              title: "3. Atualizações e Modificações",
              description1:
                "Podemos lançar atualizações ou melhorias para o aplicativo. Essas atualizações podem ser automáticas ou manuais. Você concorda em instalar tais atualizações para acesso e segurança contínuos.",
              description2:
                "Reservamo-nos o direito de modificar ou descontinuar o aplicativo a qualquer momento, sem aviso prévio.",
            },

            termination: {
              title: "4. Rescisão",
              description:
                "Esta licença permanecerá em vigor até ser rescindida. Podemos suspender ou encerrar seu acesso se você:",
              points: [
                "Violar este contrato",
                "Fizer mau uso do aplicativo",
                "Envolver-se em comportamento fraudulento, abusivo ou prejudicial",
              ],
              footer:
                "Após a rescisão, você deve excluir o aplicativo do seu dispositivo e interromper o uso imediatamente.",
            },

            warranty: {
              title: "5. Isenção de Garantia",
              description1_before: "O aplicativo é fornecido ",
              description1_highlight: '"no estado em que se encontra"',
              description1_after:
                " sem garantias de qualquer tipo. Não garantimos que o aplicativo estará livre de erros ou sempre disponível.",
              description2:
                "Na extensão máxima permitida por lei, nos isentamos de todas as garantias, expressas ou implícitas.",
            },

            liability: {
              title: "6. Limitação de Responsabilidade",
              points: [
                "Quaisquer danos resultantes do uso ou da incapacidade de usar o aplicativo",
                "Perda de dados, agendamentos perdidos ou interrupções na fila",
                "Quaisquer danos indiretos ou consequentes",
              ],
              footer: "O uso do aplicativo é por sua conta e risco.",
            },
          },
        },
      },
    },
    notification: {
      header: "Notificação",
    },
    dashboard: {
      card: {
        title: "Entre na fila virtual ou agende um horário.",
        joinQueue: "Entrar na Fila",
        book: "Agendar",
        cancel: "Cancelar",
      },
      hint: {
        label: "Info do Salão",
        readMore: "Ler mais",
        readLess: "Ler menos",
        newUpdate: "Nova atualização",
        latest: "Última:",
        update: "Atualização",
      },
      status: {
        label: "Status da Fila Ao Vivo",
        system: "Sistema",
        nextIn: "Próximo",
        onDuty: "De Plantão",
        inQueue: "Na Fila",
        online: "Online",
        offline: "Offline",
      },
      barber: {
        barbers: "Barbeiros",
        stylists: "Estilistas",
        onDuty: "De Plantão",
        no: "Não",
        available: "disponível",
        seeAll: "Ver tudo",
        online: "Online",
        offline: "Offline",
      },

      errorStatesAndApi: {
        permissionNotGranted:
          "Permissão não concedida para obter token de notificação push!",
        projectIDNotFound: "ID do projeto não encontrado",
        physicalDevicePushNotification:
          "Deve usar um dispositivo físico para notificações push",
      },
    },
    queuelist: {
      header: "Fila ao Vivo",
      barber: "BARBEIRO",
      stylist: "ESTILISTA",
      customer: "CLIENTE",
      posWait: "POS / ESPERA",
      joinQueue: "Entrar na Fila",
      empty: {
        heading: "A fila está vazia",
        subHeading: "Não há ninguém na fila agora. Seja o primeiro a entrar!",
        joinQueue: "Entrar na Fila",
      },
    },
    joinpopup: {
      header: "Entrar na Fila",
      singleJoin: {
        label: "Entrada Individual",
        subHeader:
          "Entre na fila como um cliente individual. Esta opção é para pessoas que aguardam sozinhas pelos serviços do salão.",
        buttonText: "Entrada Individual",
      },
      groupJoin: {
        label: "Entrada em Grupo",
        subHeader:
          "Entre na fila com várias pessoas de uma vez. Ideal para amigos ou membros da família que visitam o salão juntos.",
        buttonText: "Entrada em Grupo",
      },
    },
    joinQueueTypeModal: {
      header: "Selecionar Opção",
      barber: "Barbeiro",
      services: "Serviços",
    },
    singleJoinServicesBarber: {
      header: "Entrada Individual",
      barbers: "Barbeiros",
      stylists: "Estilistas",
      no: "Nenhum",
      info1: "Infelizmente, não há nenhum disponível",
      info2: "para os serviços selecionados no momento.",
      chooseServicesAgain: "Escolher Serviços Novamente",
      continue: "Continuar",

      alertBox: {
        alertOne: {
          header: "Confirmar",
          subHeader: "Se você voltar agora, sua fila será reiniciada",
          cancel: "Cancelar",
          ok: "Ok",
        },
      },
    },
    singleJoinBarberServices: {
      header: "Entrada Individual (Serviços)",
      searchInput: {
        placeholder: "Buscar serviços por categoria",
      },
      service: "serviço",
      services: "serviços",
      continue: "Continuar",
    },
    singleJoin: {
      header: "Entrada Individual (Serviços)",
      searchInput: {
        placeholder: "Buscar serviços por categoria",
      },
      service: "serviço",
      services: "serviços",
      continue: "Continuar",

      alertBox: {
        alertOne: {
          header: "Confirmar",
          subHeader: "Se você voltar agora, sua fila será reiniciada",
          cancel: "Cancelar",
          ok: "OK",
        },
      },
    },
    singleJoinBarber: {
      header: "Entrada Individual",
      barbers: "Barbeiros",
      stylists: "Estilistas",
      no: "Nenhum",
      info1: "Infelizmente, não há nenhum disponível",
      info2: "para os serviços selecionados no momento.",
      chooseServiceAgain: "Escolher Serviços Novamente",
      service: "serviço",
      services: "serviços",
      continue: "Continuar",
    },
    singleJoinModal: {
      header: "Confirmar Seleção",
      subHeader: "Tem certeza de que deseja continuar?",
      selectedBarber: "Barbeiro Selecionado",
      service: "serviço",
      services: "serviços",
      paymentBreakdown: "Detalhamento do Pagamento",
      totalAmount: "Valor Total",
      payNow: "Pagar Agora",
      deposit: "Sinal / Depósito",
      payAtSalon: "Pagar no Salão",
      proceedToPayment: "Ir para o Pagamento",
      confirmBooking: "Confirmar Agendamento",
      goBack: "Voltar",

      alertBox: {
        alertOne: {
          header: "Aviso",
          ok: "OK",
        },
        alertTwo: {
          header: "Falha no pagamento",
          subHeader: "Algo deu errado",
        },
      },

      errorStatesAndApi: {
        paymentInitializationFailed: "Falha na inicialização do pagamento",
        invalidStripeError: "Resposta do Stripe inválida",
      },
    },

    singleJoinSuccessPage: {
      header: "Você Entrou na Fila!",
      subHeader:
        "Você entrou na fila com sucesso. Você será notificado quando chegar a sua vez.",
      goToLive: "Ir para a Fila ao Vivo",
      goBackHome: "Voltar para o início",
    },
    groupHostMemberModal: {
      header: "Membro Anfitrião",
      memberInput: {
        placeholder: "Digite o nome do membro",
      },
      cancel: "Cancelar",
      add: "Adicionar",

      errorStatesAndApi: {
        memberRequired: "O nome do membro é obrigatório",
        memberLeastCharecters:
          "O nome do membro deve ter pelo menos 2 caracteres",
        memberMostCharecters:
          "O nome do membro deve ter no máximo 20 caracteres",
      },
    },
    groupJoin: {
      header: "Entrada em Grupo (Serviços)",
      searchInput: {
        placeholder: "Buscar serviços por categoria",
      },
      service: "serviço",
      services: "serviços",
      continue: "Continuar",

      alertBox: {
        header: "Descartar dados da entrada em grupo?",
        subHeader:
          "Todos os membros selecionados serão limpos e as informações de entrada em grupo serão reiniciadas.",
        cancel: "Cancelar",
        ok: "OK",
      },
    },
    groupJoinBarber: {
      header: "Entrada em Grupo (Estilistas)",
      empty: {
        header: "Nenhum Estilista",
        subHeader:
          "Infelizmente, não há estilistas disponíveis para os serviços selecionados no momento.",
        chooseServicesAgain: "Escolher Serviços Novamente",
      },
      service: "serviço",
      services: "serviços",
      continue: "Continuar",
    },
    groupJoinMembers: {
      header: "Membros do Grupo",
      you: "Você",
      host: "(Anfitrião)",
      ready: "Pronto",
      services: "Serviços:",
      stylist: "Estilista:",
      subtotal: "Subtotal:",
      addMember: "Adicionar Membro",
      member: "membro",
      members: "membros",
      joinQueue: "Entrar na Fila",

      alertBox: {
        alertOne: {
          header: "Descartar dados da entrada em grupo?",
          subHeader:
            "Todos os membros selecionados serão limpos e as informações de entrada em grupo serão reiniciadas.",
          cancel: "Cancelar",
          ok: "OK",
        },
      },
    },
    groupAddMemberModal: {
      header: "Adicionar Novo Membro",
      memberInput: {
        placeholder: "Digite o nome do membro",
      },
      cancel: "Cancelar",
      add: "Adicionar",

      errorStatesAndApi: {
        memberRequired: "O nome do membro é obrigatório",
        memberLeastCharecters:
          "O nome do membro deve ter pelo menos 2 caracteres",
        memberMostCharecters:
          "O nome do membro deve ter no máximo 20 caracteres",
      },
    },
    groupJoinModal: {
      header: "Agendamento em Grupo",
      subHeader: "Por favor, revise os detalhes do seu grupo",
      members: "Membros",
      services: "Serviços",
      time: "Horário",
      paymentBreakdown: "Detalhamento do Pagamento",
      pricingSummary: "Resumo dos Preços",
      totalAmount: "Valor Total",
      payNow: "Pagar Agora",
      deposit: "Sinal / Depósito",
      remainingBalance: "Saldo Restante",
      proceedToPayment: "Ir para o Pagamento",
      confirmGroupBooking: "Confirmar Agendamento em Grupo",
      goBack: "Voltar",

      errorStatesAndApi: {
        paymentInitializationFailed: "Falha na inicialização do pagamento",
        invalidStripeError: "Resposta do Stripe inválida",
      },

      alertBox: {
        alertOne: {
          header: "Aviso",
          ok: "OK",
        },
        alertTwo: {
          header: "Falha no pagamento",
          subHeader: "Algo deu errado",
        },
      },
    },
    groupJoinSuccessPage: {
      header: "Você Entrou na Fila!",
      subHeader: "Seu grupo entrou na fila com sucesso.",
      goToLiveQueue: "Ir para a Fila ao Vivo",
      goBackToHome: "Voltar para o início",
    },
    salon: {
      details: "Detalhes",
      services: "Serviços",
      barbers: "Barbeiros",
      stylists: "Estilistas",
      description: "Descrição",
      contactUs: "Contate-nos",
      anyQuestionInfo: "Se você tiver alguma dúvida",
      location: "Localização",
      followUsOn: "Siga-nos em",
      socialLinks: "Redes sociais",
      exploreAll: "Explorar tudo",
      no: "Nenhum",
      available: "disponível",

      favouriteToastSuccess: "Adicionado aos favoritos com sucesso",
      favouriteToastError: "Algo deu errado",
    },
    appointment: {
      header: "Agendamentos",
      noAppointment: {
        header: "Nenhum Agendamento",
        subHeader: "Você não tem nenhum agendamento para exibir.",
        buttonText: "Agendar Horário",
      },
      bookAgain: "Agendar novamente",
      services: "serviços",
      service: "serviço",
      upcoming: "Próximos",
      past: "Anteriores",
      next: "Avançar",
    },

    appointmentCalender: {
      header: "Agendar Horário",
      services: "Serviços",
      more: "mais",
      barber: "Barbeiro",
      stylist: "Estilista",
      services: "Serviços", // Preserved exact duplicate key from original structure
      date: "Data",
      time: "Hora",
      remove: "Remover",
      add: "Adicionar",
      no: "Nenhum",
      available: "disponível",
      noServicesAvailable: "Nenhum serviço disponível",
      notifyCancelation: "Notifique-me quando houver um cancelamento",
      selectBarberOrStylist: "Por favor, selecione o barbeiro/estilista",
      selectDate: "Por favor, selecione a data",
      salonClosed: "O salão está fechado neste dia.",
      selectedStylistOrBarberUnavailable:
        "O estilista/barbeiro selecionado não está disponível neste dia.",
      appointmentNote: {
        placeholder: "Digite uma observação para o seu agendamento",
      },
      step: "Passo",
      of: "de",
      stepNumber: 4,
      prev: "Anterior",
      finish: "Concluir",
      next: "Próximo",

      errorStatesAndApi: {
        selectService: "Por favor, selecione um serviço",
        selectStylist: "Por favor, selecione um estilista",
        selectBarber: "Por favor, selecione um barbeiro",
        selectTimeslot: "Por favor, selecione um horário",
        selectDate: "Por favor, selecione uma data",
      },

      alertBox: {
        header: "Confirmar",
        subHeader:
          "Se você voltar agora, o progresso do seu agendamento será perdido. Tem certeza de que deseja sair?",
        cancel: "Cancelar",
        ok: "OK",
      },
    },
    appointmentCalenderModal: {
      header: "Confirmar Agendamento",
      subHeader: "Por favor, revise os detalhes da sua reserva",
      serviceProvider: "Prestador de Serviço",
      service: "serviço",
      services: "serviços",
      date: "Data",
      time: "Hora",
      paymentBreakdown: "Detalhamento do Pagamento",
      totalAmount: "Valor Total",
      payNow: "Pagar Agora",
      deposit: "Sinal / Depósito",
      remainingBalance: "Saldo Restante",
      yourNote: "Sua Observação",
      cancellationPolicy: {
        header: "Política de Cancelamento",
        subHeader:
          "Cancelamentos em menos de 24 horas geram uma taxa de 50%. Por favor, chegue com 5 minutos de antecedência.",
      },
      proceedToPayment: "Ir para o Pagamento",
      confirmBooking: "Confirmar Agendamento",
      goBack: "Voltar",

      errorStatesAndApi: {
        noGoogleCalender: "Nenhuma agenda do Google válida foi encontrada.",
        paymentInitializationFailed: "Falha na inicialização do pagamento",
        invalidStripeError: "Resposta do Stripe inválida",
      },

      alertBox: {
        alertOne: {
          header: "Permissão Negada",
          subHeader: "Por favor, ative o acesso à agenda nas configurações.",
        },
        alertTwo: {
          header: "Sucesso",
          subHeader: "Agendamento criado! Verifique sua agenda.",
        },
        alertThree: {
          header: "Erro",
        },
        alertFour: {
          header: "Aviso",
          ok: "OK",
        },
        alertFive: {
          header: "Falha no pagamento",
          subHeader: "Algo deu errado",
        },
      },
    },
    appointmentSuccessPage: {
      appointmentBooked: "Horário Agendado!",
      appointmentUpdated: "Agendamento Atualizado!",
      bookedInfo:
        "Você agendou o horário com sucesso. Você será notificado quando chegar a sua vez.",
      updatedInfo:
        "Você atualizou o agendamento com sucesso. Você será notificado quando chegar a sua vez.",
      reminder: "Lembrete:",
      cancelationReminder:
        "alterações ou cancelamentos feitos com menos de 24 horas de antecedência do seu agendamento estarão sujeitos a uma taxa de 50%.",
      reachInfo:
        "Por favor, chegue com 5 minutos de antecedência para um atendimento sem interrupções.",
      goToAppointments: "Ir para Agendamentos",
      goBackToHome: "Voltar para o início",
    },
    appointmentPop: {
      header: "Gerenciar Agendamento",
      service: "serviço",
      services: "serviços",
      cancellation: {
        header: "Política de Cancelamento",
        subHeader:
          "Cancelamentos em menos de 24 horas geram uma taxa de 50%. Por favor, chegue com 5 minutos de antecedência.",
      },
      cancel: "Cancelar",
      edit: "Editar",

      alertBox: {
        alertOne: {
          header: "Excluir Agendamento",
          subHeader: "Tem certeza de que deseja excluir este agendamento?",
          cancel: "Cancelar",
          confirm: "Confirmar",
        },
        alertTwo: {
          header: "Aviso!",
          ok: "OK",
        },
        alertThree: {
          header: "Permissão Negada",
          subHeader: "Por favor, ative o acesso à agenda nas configurações.",
        },
      },
    },
    appointmentpopup: {
      header: "Opções de reserva",
      selectServices: {
        header: "Selecionar Serviços Primeiro",
        subHeader:
          "Escolha os serviços que você precisa primeiro. Após selecionar os serviços, você verá uma lista de barbeiros que realizam esses serviços.",
        selectServices: "Selecionar Serviços",
      },
      selectBarber: {
        header: "Selecionar Barbeiro Primeiro",
        subHeader:
          "Escolha um barbeiro primeiro. Em seguida, você verá a lista de serviços oferecidos por esse barbeiro e poderá selecionar o que deseja.",
        selectBarber: "Selecionar Barbeiro",
      },
    },
    editAppointmentCalender: {
      header: "Editar Agendamento",
      services: "Serviços",
      more: "mais",
      barber: "Barbeiro",
      stylist: "Estilista",
      services: "Serviços", // Preserved exact duplicate key from original structure
      date: "Data",
      time: "Hora",
      remove: "Remover",
      add: "Adicionar",
      no: "Nenhum",
      available: "disponível",
      noServicesAvailable: "Nenhum serviço disponível",
      notifyCancelation: "Notifique-me quando houver um cancelamento",
      selectBarberOrStylist: "Por favor, selecione o barbeiro/estilista",
      selectDate: "Por favor, selecione a data",
      salonClosed: "O salão está fechado neste dia.",
      selectedStylistOrBarberUnavailable:
        "O estilista/barbeiro selecionado não está disponível neste dia.",
      appointmentNote: {
        placeholder: "Digite uma observação para o seu agendamento",
      },
      step: "Passo",
      of: "de",
      stepNumber: 2,
      prev: "Anterior",
      finish: "Concluir",
      next: "Próximo",

      errorStatesAndApi: {
        selectDate: "Por favor, selecione uma data",
        selectTimeslot: "Por favor, selecione um horário",
      },

      alertBox: {
        alertOne: {
          header: "Confirmar",
          subHeader:
            "Se você voltar agora, o progresso da edição do agendamento será perdido. Tem certeza de que deseja sair?",
          cancel: "Cancelar",
          ok: "OK",
        },
      },
    },
    editAppointmentCalenderModal: {
      header: "Confirmar Agendamento",
      subHeader: "Por favor, revise os detalhes da sua reserva",
      serviceProvider: "Prestador de Serviço",
      service: "serviço",
      services: "serviços",
      date: "Data",
      time: "Hora",
      paymentBreakdown: "Detalhamento do Pagamento",
      totalAmount: "Valor Total",
      payNow: "Pagar Agora",
      deposit: "Sinal / Depósito",
      remainingBalance: "Saldo Restante",
      yourNote: "Sua Observação",
      cancellationPolicy: {
        header: "Política de Cancelamento",
        subHeader:
          "Cancelamentos em menos de 24 horas geram uma taxa de 50%. Por favor, chegue com 5 minutos de antecedência.",
      },
      proceedToPayment: "Ir para o Pagamento",
      saveBooking: "Salvar Agendamento",
      confirmBooking: "Confirmar Agendamento",
      goBack: "Voltar",

      errorStatesAndApi: {
        googleCalenderNotFound:
          "Nenhuma agenda do Google válida foi encontrada.",
      },

      alertBox: {
        alertOne: {
          header: "Permissão Negada",
          subHeader: "Por favor, ative o acesso à agenda nas configurações.",
        },
        alertTwo: {
          header: "Sucesso",
          subHeader: "Agendamento atualizado! Por favor, verifique sua agenda.",
        },
        alertThree: {
          header: "Erro",
          subHeader: "Evento de agendamento não encontrado!",
        },
        alertFour: {
          header: "Erro",
        },
        alertFive: {
          header: "Aviso",
          ok: "OK",
        },
      },
    },
  },
};
