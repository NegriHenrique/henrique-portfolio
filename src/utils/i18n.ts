export const dict = {
  pt: {
    hero: {
      title: "Henrique Negri",
      callout1: "Design que converte.",
      callout2: "Engenharia que escala.",
      btnMeeting: "Agendar Reunião",
      btnWorks: "Ver Casos de Estudo"
    },
    about: {
      title1: "Engenharia orientada a escala.",
      title2: "Design focado no humano.",
      description: "Formação em Ciência da Computação. Expertise em UX. Eu transformo lógica complexa em experiências fluídas, sem intermediários.",
      btnFreelance: "[ Fechar Projeto ]",
      btnRecruiter: "[ Avaliar Código ]"
    },
    contact: {
      title1: "Seu produto merece",
      title2: "Engenharia de Elite.",
      description: "Escolha um horário na agenda ao lado para discutirmos escopo, arquitetura ou mentoria. Se preferir algo mais rápido, meus canais diretos estão abertos."
    },
    worksList: {
      fallbackImage: "SEM IMAGEM",
      fallbackTag: "Engenharia Criativa"
    },
    skills: {
      arsenal: "Arsenal",
      data: [
        {
          id: "web-design",
          title: "Web Design",
          type: "designer" as const,
          process: [
            {
              title: "01. Descoberta Estratégica",
              description: "Imersão total no seu modelo de negócio para mapear o público-alvo, analisar concorrentes e estruturar a jornada que trará o maior retorno financeiro.",
              tools: ["Miro", "Hotjar"]
            },
            {
              title: "02. Wireframes de Alta Fidelidade",
              description: "Projeção da estrutura física da interface focada na escaneabilidade rápida e na retenção do usuário.",
              tools: ["Figma"]
            },
            {
              title: "03. Design System Escalável",
              description: "Construção de componentes reutilizáveis, consistentes e milimetricamente alinhados à identidade da sua marca.",
              tools: ["Figma"]
            }
          ]
        },
        {
          id: "engenharia-web",
          title: "Engenharia Web",
          type: "developer" as const,
          process: [
            {
              title: "01. Arquitetura de Performance",
              description: "Planejamento estrutural do repositório utilizando padrões modulares, tipagem estrita e foco em SEO técnico.",
              tools: ["VSCode", "Git"]
            },
            {
              title: "02. Desenvolvimento Fullstack",
              description: "Codificação limpa com React e Astro, aplicando gerenciamento de estado ultra-otimizado com Zustand.",
              tools: ["Astro", "React", "Zustand"]
            },
            {
              title: "03. Otimização & Escala Cloud",
              description: "Garantia de carregamento instantâneo (LCP < 2s) e infraestrutura resiliente pronta para milhares de acessos.",
              tools: ["AWS", "Azure", "Tailwind CSS"]
            }
          ]
        },
        {
          id: "mentoria",
          title: "Mentoria Técnica",
          type: "developer" as const,
          process: [
            {
              title: "01. Diagnóstico & Code Review",
              description: "Análise profunda de arquiteturas existentes e revisão minuciosa de código para elevar a qualidade do seu time técnico.",
              tools: ["GitHub", "IntelliJ"]
            },
            {
              title: "02. Engenharia de Carreira",
              description: "Direcionamento estratégico prático para acelerar a evolução de desenvolvedores rumo a cargos Sênior e Tech Lead.",
              tools: ["Mentoria Estratégica"]
            },
            {
              title: "03. System Design de Elite",
              description: "Capacitação em design de sistemas complexos, Clean Code, documentação inteligente e boas práticas de mercado.",
              tools: ["System Design", "Soft Skills"]
            }
          ]
        }
      ]
    }
  },
  en: {
    hero: {
      title: "Henrique Negri",
      callout1: "Design that converts.",
      callout2: "Engineering that scales.",
      btnMeeting: "Book a Meeting",
      btnWorks: "View Case Studies"
    },
    about: {
      title1: "Scale-oriented engineering.",
      title2: "Human-centric design.",
      description: "Computer Science background. UX expertise. I transform complex logic into fluid experiences, with no intermediaries.",
      btnFreelance: "[ Close Project ]",
      btnRecruiter: "[ Evaluate Code ]"
    },
    contact: {
      title1: "Your product deserves",
      title2: "Elite Engineering.",
      description: "Choose a time on the calendar to discuss scope, architecture, or mentoring. If you prefer something faster, my direct channels are open."
    },
    worksList: {
      fallbackImage: "NO IMAGE",
      fallbackTag: "Creative Engineering"
    },
    skills: {
      arsenal: "Arsenal",
      data: [
        {
          id: "web-design",
          title: "Web Design",
          type: "designer" as const,
          process: [
            {
              title: "01. Strategic Discovery",
              description: "Total immersion in your business model to map the target audience, analyze competitors, and structure the journey that will bring the highest financial return.",
              tools: ["Miro", "Hotjar"]
            },
            {
              title: "02. High-Fidelity Wireframes",
              description: "Projection of the interface's physical structure focused on fast scannability and user retention.",
              tools: ["Figma"]
            },
            {
              title: "03. Scalable Design System",
              description: "Construction of reusable, consistent components that are perfectly aligned with your brand identity.",
              tools: ["Figma"]
            }
          ]
        },
        {
          id: "engenharia-web",
          title: "Web Engineering",
          type: "developer" as const,
          process: [
            {
              title: "01. Performance Architecture",
              description: "Structural planning of the repository using modular patterns, strict typing, and a focus on technical SEO.",
              tools: ["VSCode", "Git"]
            },
            {
              title: "02. Fullstack Development",
              description: "Clean coding with React and Astro, applying ultra-optimized state management with Zustand.",
              tools: ["Astro", "React", "Zustand"]
            },
            {
              title: "03. Cloud Scale & Optimization",
              description: "Guarantee of instant loading (LCP < 2s) and resilient infrastructure ready for thousands of accesses.",
              tools: ["AWS", "Azure", "Tailwind CSS"]
            }
          ]
        },
        {
          id: "mentoria",
          title: "Technical Mentoring",
          type: "developer" as const,
          process: [
            {
              title: "01. Diagnostics & Code Review",
              description: "Deep analysis of existing architectures and meticulous code review to elevate the quality of your technical team.",
              tools: ["GitHub", "IntelliJ"]
            },
            {
              title: "02. Career Engineering",
              description: "Practical strategic guidance to accelerate developers' evolution towards Senior and Tech Lead roles.",
              tools: ["Mentoria Estratégica"]
            },
            {
              title: "03. Elite System Design",
              description: "Training in complex system design, Clean Code, smart documentation, and best market practices.",
              tools: ["System Design", "Soft Skills"]
            }
          ]
        }
      ]
    }
  }
};
