import { useState } from 'react'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { TextGenerateEffect } from '../../../theme/TextGenerateEffect'
// import { TypewriterEffect } from '../../../theme/TypeWriterEffect'

const MarkdownWrapper = ({ children, isLastElement = false }: { children: string, isLastElement?: boolean}) => {
    const [didRender, setDidRender] = useState(false);
    return (
        <Markdown
            children={children}
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={{
                code({ node, className, children, ...props }) {
                    // console.log("code element props: ", props)
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <SyntaxHighlighter
                            // {...props}    
                            // ref={(ref: React.RefObject<SyntaxHighlighter> | null) => {
                            //     // handle ref here
                            //     if (ref && ref.current) {
                            //         (ref.current as any)?.highlightAll();
                            //     }
                            // }}
                            PreTag="div"
                            language={match[1]}
                            style={dark}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code {...props} className={className}>
                            {children}
                        </code>
                    );
                },
                img: (props) => <LazyLoadImage {...props} effect="blur" />,
                ...isLastElement && {
                    p: (props) => !didRender 
                        ? <TextRenderWrapper children={props.children} setDidRender={setDidRender} />
                        : <p>{props.children}</p>
                }
                // p: (props) => <TypewriterEffect words={props.children.split(' ')} />,
            }}
        />
    )
}

export default MarkdownWrapper

const TextRenderWrapper = (props: any) => {
    const { children, setDidRender } = props;

    setDidRender(true);

    return <TextGenerateEffect words={(children as string)} />;
}