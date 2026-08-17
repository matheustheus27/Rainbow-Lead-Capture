export type Language = 'pt-BR' | 'en';

export interface Translations {
  common: {
    brandTitle: string;
    brandSubtitle: string;
  };
  form: {
    title: string;
    subtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    cpfLabel: string;
    cpfHint: string;
    emailLabel: string;
    emailPlaceholder: string;
    colorLabel: string;
    colorHint: string;
    selectedColorLabel: string;
    selectColorPrompt: string;
    notesLabel: string;
    notesPlaceholder: string;
    notesHint: string;
    submitButton: string;
    submittingButton: string;
    botVerificationTitle: string;
    botVerificationNew: string;
    botVerificationPlaceholder: string;
    botVerificationLoading: string;
  };
  admin: {
    title: string;
    subtitle: string;
    activeAdmin: string;
    refresh: string;
    refreshing: string;
    totalLeads: string;
    topColor: string;
    latestLead: string;
    noneYet: string;
    analyticsTitle: string;
    analyticsSubtitle: string;
    leads: string;
    filterBy: string;
    allColors: string;
    searchPlaceholder: string;
    customerDirectory: string;
    recordsFound: string;
    recordFound: string;
    colCustomer: string;
    colCpf: string;
    colEmail: string;
    colColor: string;
    colNotes: string;
    colRegisteredAt: string;
    noNotes: string;
    noRecordsTitle: string;
    noRecordsDesc: string;
  };
  colors: Record<string, string>;
  errors: {
    nameRequired: string;
    nameMinLength: string;
    cpfRequired: string;
    cpfInvalid: string;
    emailRequired: string;
    emailInvalid: string;
    colorRequired: string;
    captchaRequired: string;
    formIncomplete: string;
  };
  nav: {
    formTab: string;
    adminTab: string;
    loginTab: string;
    logout: string;
    adminUser: string;
  };
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    submitLogin: string;
    submittingLogin: string;
    quickFill: string;
  };
  footer: {
    developedBy: string;
    authorName: string;
    authorLink: string;
  };
}

export const translations: Record<Language, Translations> = {
  'pt-BR': {
    common: {
      brandTitle: 'IrisCRM',
      brandSubtitle: 'Captura Inteligente de Leads',
    },
    form: {
      title: 'Cadastro de Clientes',
      subtitle: 'Preencha seus dados para receber o contato personalizado da nossa equipe',
      fullNameLabel: 'Nome Completo',
      fullNamePlaceholder: 'Ex: Maria Silva',
      cpfLabel: 'Número de CPF',
      cpfHint: '11 dígitos',
      emailLabel: 'E-mail',
      emailPlaceholder: 'maria@exemplo.com',
      colorLabel: 'Cor Favorita do Arco-Íris',
      colorHint: 'Selecione seu tom vibrante',
      selectedColorLabel: 'Cor Selecionada:',
      selectColorPrompt: 'Toque em um círculo para escolher',
      notesLabel: 'Observações / Notas',
      notesPlaceholder: 'Adicione qualquer contexto ou observação relevante...',
      notesHint: 'Opcional',
      submitButton: 'Enviar Cadastro',
      submittingButton: 'Processando Cadastro...',
      botVerificationTitle: 'Desafio Anti-Robô',
      botVerificationNew: 'Novo Desafio',
      botVerificationPlaceholder: 'Resolver desafio...',
      botVerificationLoading: 'Gerando...',
    },
    admin: {
      title: 'Painel de Inteligência de Leads',
      subtitle: 'Métricas analíticas e distribuição cromática em tempo real',
      activeAdmin: 'Sessão Ativa:',
      refresh: 'Atualizar Dados',
      refreshing: 'Atualizando...',
      totalLeads: 'Total de Leads',
      topColor: 'Tom Mais Popular',
      latestLead: 'Último Registro',
      noneYet: 'Nenhum ainda',
      analyticsTitle: 'Distribuição de Preferência Cromática',
      analyticsSubtitle: 'Proporção de escolhas de cores entre todos os clientes registrados',
      leads: 'leads',
      filterBy: 'Filtrar por',
      allColors: 'Todas as Cores',
      searchPlaceholder: 'Buscar por nome, CPF ou e-mail...',
      customerDirectory: 'Diretório de Clientes',
      recordsFound: 'registros encontrados',
      recordFound: 'registro encontrado',
      colCustomer: 'Cliente',
      colCpf: 'Número do CPF',
      colEmail: 'E-mail',
      colColor: 'Preferencia de Cor',
      colNotes: 'Observações',
      colRegisteredAt: 'Cadastrado em',
      noNotes: 'Sem observações registradas',
      noRecordsTitle: 'Nenhum registro encontrado',
      noRecordsDesc: 'Tente ajustar os termos da sua busca ou filtros aplicados.',
    },
    colors: {
      Red: 'Vermelho',
      Vermelho: 'Vermelho',
      Orange: 'Laranja',
      Laranja: 'Laranja',
      Yellow: 'Amarelo',
      Amarelo: 'Amarelo',
      Green: 'Verde',
      Verde: 'Verde',
      Blue: 'Azul',
      Azul: 'Azul',
      Indigo: 'Índigo',
      Índigo: 'Índigo',
      Anil: 'Anil',
      Violet: 'Violeta',
      Violeta: 'Violeta',
    },
    errors: {
      nameRequired: 'Nome completo é obrigatório.',
      nameMinLength: 'Nome deve ter pelo menos 3 caracteres.',
      cpfRequired: 'Número de CPF é obrigatório.',
      cpfInvalid: 'Dígitos verificadores ou formato de CPF inválido.',
      emailRequired: 'E-mail é obrigatório.',
      emailInvalid: 'Por favor, insira um e-mail válido.',
      colorRequired: 'Por favor, selecione uma cor do arco-íris.',
      captchaRequired: 'Por favor, resolva o desafio matemático.',
      formIncomplete: 'Por favor, preencha todos os campos obrigatórios e resolva o desafio matemático.',
    },
    nav: {
      formTab: 'Formulário',
      adminTab: 'Painel Admin',
      loginTab: 'Entrar',
      logout: 'Sair',
      adminUser: 'Administrador',
    },
    login: {
      title: 'Acesso Administrativo',
      subtitle: 'Entre com suas credenciais para gerenciar leads e métricas',
      emailLabel: 'E-mail Administrativo',
      passwordLabel: 'Senha',
      submitLogin: 'Acessar Painel',
      submittingLogin: 'Autenticando...',
      quickFill: 'Preencher Demo (admin@iriscrm.com)',
    },
    footer: {
      developedBy: 'IrisCRM • Desenvolvido por ',
      authorName: 'Matheus Ferreira',
      authorLink: 'https://github.com/matheustheus27'
    },
  },
  en: {
    common: {
      brandTitle: 'IrisCRM',
      brandSubtitle: 'Intelligent Lead Capture',
    },
    form: {
      title: 'Customer Registration',
      subtitle: 'Complete your information to connect with our dedicated team',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g. Maria Silva',
      cpfLabel: 'CPF Number',
      cpfHint: '11 digits',
      emailLabel: 'E-mail',
      emailPlaceholder: 'maria@example.com',
      colorLabel: 'Favorite Rainbow Color',
      colorHint: 'Select your vibrant tone',
      selectedColorLabel: 'Selected Color:',
      selectColorPrompt: 'Tap a color token to choose',
      notesLabel: 'Observations / Notes',
      notesPlaceholder: 'Add any specific context or business observations here...',
      notesHint: 'Optional',
      submitButton: 'Submit Registration',
      submittingButton: 'Processing Registration...',
      botVerificationTitle: 'Bot Verification Challenge',
      botVerificationNew: 'New Puzzle',
      botVerificationPlaceholder: 'Solve puzzle...',
      botVerificationLoading: 'Generating...',
    },
    admin: {
      title: 'Lead Intelligence Dashboard',
      subtitle: 'Real-time analytics and chromatic preference distribution',
      activeAdmin: 'Active Session:',
      refresh: 'Refresh Data',
      refreshing: 'Refreshing...',
      totalLeads: 'Total Leads',
      topColor: 'Top Color Choice',
      latestLead: 'Latest Registration',
      noneYet: 'None yet',
      analyticsTitle: 'Chromatic Distribution Analysis',
      analyticsSubtitle: 'Distribution of color selections across registered leads',
      leads: 'leads',
      filterBy: 'Filter by',
      allColors: 'All Colors',
      searchPlaceholder: 'Search by name, CPF or email...',
      customerDirectory: 'Customer Directory',
      recordsFound: 'records found',
      recordFound: 'record found',
      colCustomer: 'Customer',
      colCpf: 'CPF Number',
      colEmail: 'E-mail',
      colColor: 'Color Preference',
      colNotes: 'Notes',
      colRegisteredAt: 'Registered At',
      noNotes: 'No notes provided',
      noRecordsTitle: 'No customer records found',
      noRecordsDesc: 'Try adjusting your search query or filter criteria.',
    },
    colors: {
      Red: 'Red',
      Vermelho: 'Red',
      Orange: 'Orange',
      Laranja: 'Orange',
      Yellow: 'Yellow',
      Amarelo: 'Yellow',
      Green: 'Green',
      Verde: 'Green',
      Blue: 'Blue',
      Azul: 'Blue',
      Indigo: 'Indigo',
      Índigo: 'Indigo',
      Anil: 'Indigo',
      Violet: 'Violet',
      Violeta: 'Violet',
    },
    errors: {
      nameRequired: 'Full name is required.',
      nameMinLength: 'Name must have at least 3 characters.',
      cpfRequired: 'CPF number is required.',
      cpfInvalid: 'Invalid CPF check digits or structure.',
      emailRequired: 'Email address is required.',
      emailInvalid: 'Please enter a valid email address.',
      colorRequired: 'Please select a rainbow color.',
      captchaRequired: 'Please solve the math puzzle.',
      formIncomplete: 'Please complete all required fields and solve the math puzzle.',
    },
    nav: {
      formTab: 'Form',
      adminTab: 'Admin Panel',
      loginTab: 'Login',
      logout: 'Sign Out',
      adminUser: 'Administrator',
    },
    login: {
      title: 'Administrative Access',
      subtitle: 'Sign in with your credentials to manage customer leads and analytics',
      emailLabel: 'Admin E-mail',
      passwordLabel: 'Password',
      submitLogin: 'Sign In to Dashboard',
      submittingLogin: 'Authenticating...',
      quickFill: 'Fill Demo (admin@iriscrm.com)',
    },
    footer: {
      developedBy: 'IrisCRM • Developed by ',
      authorName: 'Matheus Ferreira',
      authorLink: 'https://github.com/matheustheus27'
    },
  },
};
