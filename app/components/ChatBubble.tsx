import { StaticImageData } from "next/image";
import Image from "next/image";

type ChatBubbleData = {
  owner: boolean;
  image: StaticImageData;
  children: React.ReactNode;
};

export default function ChatBubble({ owner, image, children }: ChatBubbleData) {
  return (
    <div
      data-owner={owner}
      className="flex w-full flex-row items-start gap-3 data-[owner=false]:mr-auto data-[owner=true]:ml-auto data-[owner=true]:flex-row-reverse md:w-8/12 lg:w-7/12 xl:w-6/12"
    >
      <Image
        src={image}
        width={64}
        height={64}
        alt="Profile picture"
        className="rounded-full"
      />
      <p
        data-owner={owner}
        className="rounded-3xl p-8 data-[owner=false]:bg-stone-800 data-[owner=true]:bg-stone-400 data-[owner=true]:text-stone-900"
      >
        {children}
      </p>
    </div>
  );
}
