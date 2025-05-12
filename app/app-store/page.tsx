import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

export default function AppStorePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-[#002060]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para o app
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-[#002060] mb-6">Publicação na App Store</h1>

          <div className="prose max-w-none">
            <p>
              Para publicar o Salão Musical como um aplicativo nativo na App Store, você pode usar o PWABuilder para
              converter seu PWA em um aplicativo iOS.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Passo 1: Preparar seu PWA</h2>
            <p>Antes de começar, certifique-se de que seu PWA atende a todos os requisitos básicos:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Manifesto válido com todos os ícones necessários</li>
              <li>Service Worker funcional</li>
              <li>Design responsivo</li>
              <li>Funcionalidade offline</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">Passo 2: Usar o PWABuilder</h2>
            <ol className="list-decimal pl-5 space-y-3 mb-4">
              <li>
                Acesse{" "}
                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  PWABuilder <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>Digite a URL do seu PWA (ex: https://salao.avisatudo.com)</li>
              <li>Clique em "Start" para analisar seu PWA</li>
              <li>Após a análise, clique em "Build" e selecione "iOS"</li>
              <li>Configure as opções do aplicativo iOS</li>
              <li>Clique em "Generate" para criar o pacote iOS</li>
            </ol>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-blue-700">
                <strong>Dica:</strong> O PWABuilder gera um projeto Xcode que você pode personalizar antes de enviar
                para a App Store.
              </p>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-3">Passo 3: Preparar para a App Store</h2>
            <p>Para publicar na App Store, você precisará:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                Uma conta de desenvolvedor Apple (US$ 99/ano) -
                <a
                  href="https://developer.apple.com/programs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Apple Developer Program
                </a>
              </li>
              <li>Um Mac com Xcode instalado</li>
              <li>Certificados de assinatura e perfis de provisionamento</li>
              <li>Capturas de tela do aplicativo em vários tamanhos de dispositivo</li>
              <li>Ícone do aplicativo em alta resolução</li>
              <li>Descrição do aplicativo, palavras-chave e metadados</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">Passo 4: Enviar para a App Store</h2>
            <ol className="list-decimal pl-5 space-y-3 mb-4">
              <li>Abra o projeto Xcode gerado pelo PWABuilder</li>
              <li>Configure os identificadores de pacote, versão e equipe de desenvolvimento</li>
              <li>Teste o aplicativo em simuladores e dispositivos reais</li>
              <li>Prepare os metadados e capturas de tela no App Store Connect</li>
              <li>Envie o aplicativo para revisão da Apple</li>
            </ol>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
              <p className="text-yellow-700">
                <strong>Importante:</strong> A Apple tem diretrizes rigorosas para aprovação de aplicativos.
                Certifique-se de que seu aplicativo oferece funcionalidade além de simplesmente exibir um site. Adicione
                recursos nativos como notificações push, integração com câmera ou outros recursos específicos de
                dispositivo.
              </p>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-3">Alternativas ao PWABuilder</h2>
            <p>Existem outras opções para criar aplicativos iOS a partir de seu PWA:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <a
                  href="https://capacitorjs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Capacitor
                </a>{" "}
                - Da equipe do Ionic, permite empacotar PWAs como aplicativos nativos
              </li>
              <li>
                <a
                  href="https://cordova.apache.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Apache Cordova
                </a>{" "}
                - Uma plataforma estabelecida para criar aplicativos móveis usando HTML, CSS e JavaScript
              </li>
              <li>
                <a
                  href="https://www.gonative.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GoNative.io
                </a>{" "}
                - Serviço pago que converte sites em aplicativos nativos
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">Considerações finais</h2>
            <p>
              Publicar na App Store requer investimento de tempo e dinheiro, mas pode valer a pena para alcançar
              usuários iOS com uma experiência nativa completa, incluindo notificações push e outros recursos que não
              estão disponíveis para PWAs no iOS.
            </p>
            <p className="mt-2">
              Se precisar de ajuda profissional com este processo, considere contratar um desenvolvedor iOS ou uma
              agência especializada em publicação de aplicativos.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#002060] text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o app
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
