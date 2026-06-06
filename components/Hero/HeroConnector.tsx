import { renderRichTextContent } from '../../utils/RichText';
import { Hero } from './Hero';

export const HeroConnector = (props: any) => {
  return (
    <Hero
      id={props?.id}
      images={props?.media}
      locale={props?.locale}
      animationID={props?.animationID}
      content={renderRichTextContent(props?.content, { priorityFirstImage: true })}
      height={props?.height}
      size={props?.size}
      imageAlignment={props?.imageAlignment}
      anchorToNext={props?.anchorToNext}
    />
  );
};
