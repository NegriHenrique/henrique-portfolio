import { LazyIframe } from "../LazyIframe";

export function Lab() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-foreground/10">
      <div className="mb-12">
        <h2 className="text-3xl font-bold">Laboratório & Estudos</h2>
        <p className="text-foreground/70 mt-4 max-w-2xl">
          Ambientes interativos onde aplico conceitos de interação e arquitetura
          de componentes. Abaixo, um exemplo de protótipo navegável incorporado
          diretamente do Figma.
        </p>
      </div>

      {/* Placeholder durante SSR - LazyIframe é renderizado apenas no client */}
      <div className="w-full aspect-video rounded-xl shadow-lg bg-foreground/5 flex items-center justify-center">
        <LazyIframe
          src="https://www.figma.com/design/oAmpiqQ9qqmw5KTTFBefqp/Desperte-redesenho?node-id=245-36&t=P873p0tQHKnUlp8y-1"
          title="Figma Prototype"
          containerClassName="w-full aspect-video rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
