import { AlignCenterHorizontal, ArrowLeft, Camera } from "phosphor-react";
import { FormEvent, useState } from "react";
import { FeedbackType, feedbackTypes } from "..";
import { api } from "../../../libs/api";
import { CloseButton } from "../../CloseButton";
import { Loading } from "../../Loading";
import { ScreenshotButton } from "../ScreenshotButton";

interface FeedContentStepProps {
  feedbackType: FeedbackType;
  onFeedbackRestartRequest: () => void;
  onFeedbackSent: () => void;
}

export function FeedbackContentStep({
  feedbackType, 
  onFeedbackRestartRequest,
  onFeedbackSent,
}: FeedContentStepProps) {

  const feedbackTypeInfo = feedbackTypes[feedbackType]; 
  const [ screenshot, setScreenshot ] = useState<string | null>(null)
  const [ comment, setComment ] = useState('');
  const [ isSending, setIsSending ] = useState(false);

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault();

    setIsSending(true);

    await api.post('/feedbacks', {
      type: feedbackType,
      comment,
      screenshot,
    })

    onFeedbackSent();
    setIsSending(false);
  }

  return (
    <>
      <header>
        <button onClick={onFeedbackRestartRequest}>
          <ArrowLeft weight="bold" className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"/>
        </button>        
        <span className="text-xl leading-6 flex items-center gap-2">
          <img src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.image.alt} />
          {feedbackTypeInfo.title}
        </span>
        <CloseButton />
      </header>
      <form className="my-4 w-full" onSubmit={handleSubmitFeedback}>
        <textarea 
          className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-x-brand-500 focus:ring-brand-500 focus:ring-1 resize-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin" 
          placeholder="Conte com detalhes o que está acontecendo..."
          onChange={event => setComment(event.target.value)}
          autoFocus
        />
        <footer className="flex gap-2 mt-2">
          <ScreenshotButton isComment={ comment.length === 0 } screenshot={screenshot} onScreenshotTook={setScreenshot}/>
          <button
            type="submit"
            disabled={ comment.length === 0 || isSending}
            className="p-2 bg-brand-500 rounded-mdfw border-transparent flex-1 justify-center items-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:hover:bg-brand-500"
          >
            {isSending ? <Loading /> : "Enviar Feedback" }
          </button>
        </footer>
      </form>
    </>
  );
}