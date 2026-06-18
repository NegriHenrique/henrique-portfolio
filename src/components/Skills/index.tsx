// src/components/Skills.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { Search, Code2, Rocket } from "lucide-react";

export function Skills() {
  const skillGroups = [
    {
      title: "Descoberta & UX",
      icon: <Search className="text-primary mb-4" size={32} />,
      description: "Pesquisa, prototipação e validação focada no usuário.",
      items: ["UX Research (UX-PM)", "Figma", "Prototipagem Alta Fidelidade", "Design Systems"],
    },
    {
      title: "Construção (Frontend)",
      icon: <Code2 className="text-primary mb-4" size={32} />,
      description: "Arquitetura Spec-Driven e desenvolvimento de interfaces.",
      items: ["React & Next.js", "Astro", "Tailwind CSS & CVA", "TypeScript"],
    },
    {
      title: "Escala & Deploy",
      icon: <Rocket className="text-primary mb-4" size={32} />,
      description: "Infraestrutura, CI/CD e distribuição de pacotes.",
      items: ["GitHub Actions", "Vercel", "NPM Publishing", "Supabase"],
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold">Stack de Entrega</h2>
        <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
          Ferramentas não definem o profissional, mas dominá-las acelera a ponte entre a ideia e a produção.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="p-6 rounded-xl border border-foreground/10 bg-background hover:border-primary/30 transition-colors"
          >
            {group.icon}
            <h3 className="text-xl font-bold mb-2">{group.title}</h3>
            <p className="text-sm text-foreground/70 mb-6 min-h-[40px]">
              {group.description}
            </p>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}