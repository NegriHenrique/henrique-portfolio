import { motion } from "framer-motion";

export function About() {
  return (
    <section id="processo" className="w-full max-w-4xl mx-auto px-6 py-24 border-t border-foreground/10">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-2 gap-12 items-start"
      >
        <div>
          <h2 className="text-3xl font-bold mb-6">A ponte entre o Figma e o Deploy.</h2>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              Acredito que a dicotomia entre "quem desenha" e "quem codifica" gera gargalos. Minha abordagem elimina essa fricção.
            </p>
            <p>
              Com certificação <strong>UX-PM</strong>, minha visão de produto atua como filtro: garanto que as interfaces sejam acessíveis e centradas no usuário antes de escrever a primeira linha de código. No frontend, aplico arquitetura Spec-Driven para garantir que os componentes reflitam os tokens exatos do design system.
            </p>
          </div>
        </div>
        
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 h-full flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-4 text-primary">Core Loop</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-foreground/10">1</span>
              Descoberta & UX Research
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-foreground/10">2</span>
              Prototipação de Alta Fidelidade
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-foreground/10">3</span>
              Engenharia de Componentes (React/Astro)
            </li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}