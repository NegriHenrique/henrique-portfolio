import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Mail, MessageCircle } from "lucide-react";
import { buttonVariants } from "../ui/Button";
import { cn } from "../../utils/cn";

export function Contact() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark", // Mantemos o dark mode do MVP
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-foreground/10" id="contato">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Vamos conversar?</h2>
        <p className="text-foreground/70 mt-4 max-w-xl mx-auto">
          Elimine o atrito do vai-e-vem de e-mails. Agende um horário diretamente na minha agenda abaixo ou utilize os canais diretos.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Container do Calendário */}
          <div className="bg-background rounded-xl border border-foreground/10 overflow-hidden min-h-[400px] flex items-center justify-center">
          <Cal 
            calLink="henrique-negri/30min"
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: 'month_view', theme: "dark" }}
          />
        </div>

        {/* Ações Secundárias */}
        <div className="flex flex-col gap-4">
          <div className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 text-center">
              <h3 className="font-semibold mb-4 text-left">Canais Diretos</h3>
            <div className="flex flex-col gap-3">
              {/* Substitua os links pelos seus dados reais */}
              <a 
                href="https://wa.me/5500000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start gap-3")}
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a 
                href="mailto:seu-email@dominio.com" 
                className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start gap-3")}
              >
                <Mail size={18} />
                E-mail
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}