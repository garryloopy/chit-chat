import { StaticImageData } from "next/image";
import Image from "next/image";

type ChatBubbleData = {
  isSelf: boolean;
  image: StaticImageData;
  children: React.ReactNode;
};

export default function ChatBubble({
  isSelf,
  image,
  children,
}: ChatBubbleData) {
  return (
    <div
      data-isSelf={isSelf}
      className="flex w-full flex-row items-start gap-3 data-[isSelf=false]:mr-auto data-[isSelf=true]:ml-auto data-[isSelf=true]:flex-row-reverse md:w-8/12 lg:w-7/12 xl:w-6/12"
    >
      <Image
        src={image}
        width={64}
        height={64}
        alt="Profile picture"
        className="rounded-full"
      />
      <p
        data-isSelf={isSelf}
        className="rounded-3xl p-8 data-[isSelf=false]:bg-stone-800 data-[isSelf=true]:bg-stone-400 data-[isSelf=true]:text-stone-900"
      >
        {children}
      </p>
    </div>
  );
}
