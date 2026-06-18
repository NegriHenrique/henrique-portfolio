import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { buttonVariants } from "../ui/Button";
import { cn } from "../../utils/cn";

export function Hero() {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-4">
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, ease: "easeOut", repeat: Infinity }}
            className="flex h-2 w-2 rounded-full bg-primary"
          />
          Disponível para novos desafios
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
          Sinergia entre <span className="text-primary">Product Design</span> e
          Engenharia.
        </h1>

        <p className="text-base md:text-xl text-foreground/70 max-w-2xl leading-relaxed">
          Olá, sou Henrique Negri Rodrigues. Traduzo necessidades de negócio em
          arquiteturas visuais escaláveis e escrevo o código que as traz à vida
          com excelência em performance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="#works"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Ver Casos de Estudo <ArrowRight size={18} />
          </a>
          <a
            href="#processo"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2",
            )}
          >
            Meu Processo <Terminal size={18} />
          </a>
          <a
            href="#contato"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2",
            )}
          >
            Falar com o Henrique <Terminal size={18} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
