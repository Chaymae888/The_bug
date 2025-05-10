import { DecoratorNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput, NodeKey } from 'lexical';
import { JSX } from 'react';


export function $createImageNode(
    src: string,
    altText: string,
    maxWidth: number = 400,
    width: 'inherit' | number = 'inherit',
    height: 'inherit' | number = 'inherit',
    key?: NodeKey
  ): ImageNode {
    return new ImageNode(src, altText, maxWidth, width, height, key);
  }
  // Add this to your ImageNode.ts file
let registered = false;

export function registerImageNode(editorConfig: any) {
  if (!registered) {
    editorConfig.nodes.push(ImageNode);
    registered = true;
  }
  return editorConfig;
}
const convertImageElement = (domeNode : Node):DOMConversionOutput | null => {
    if (domeNode instanceof HTMLImageElement) {
        const { src, alt } = domeNode;
        const node = $createImageNode(src, alt, 400);
        return {node};
    }
    return null;

}
export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;
    __height: 'inherit' | number;
    __width: 'inherit' | number;
    __maxWidth:  number;

    constructor(
        src: string,
        altText: string,
        maxWidth: number = 400,
        width: 'inherit' | number = 'inherit',
        height: 'inherit' | number = 'inherit',
        key?: NodeKey
      ) {
        super(key || undefined);
        if (this.getType() !== 'image') {
          throw new Error(`ImageNode type mismatch: ${this.getType()} !== image`);
        }
    
        this.__src = src;
        this.__altText = altText;
        this.__maxWidth = maxWidth;
        this.__width = width;
        this.__height = height;
      }

    static getType(): string {
        return 'image';
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
          node.__src,
          node.__altText,
          node.__maxWidth,
          node.__width,
          node.__height,
          node.__key // Crucial to pass the key
        );
      }

    decorate(): JSX.Element {
        return(
            <img
                src={this.__src}
                alt={this.__altText}
                style={{
                    maxWidth: this.__maxWidth,
                    width: this.__width,
                    height: this.__height,
                }}
            />
        );
    }

    createDOM(): HTMLElement {
        const img = document.createElement('img');
        img.src = this.__src;
        img.alt = this.__altText;
        img.style.maxWidth = `${this.__maxWidth}px`;
        img.style.width = this.__width === 'inherit' ? 'inherit' : `${this.__width}px`;
        img.style.height = this.__height === 'inherit' ? 'inherit' : `${this.__height}px`;
        return img;
      }
    
      updateDOM(prevNode: ImageNode, dom: HTMLElement): boolean {
        // Only update if properties changed
        if (
          prevNode.__src !== this.__src ||
          prevNode.__altText !== this.__altText ||
          prevNode.__maxWidth !== this.__maxWidth ||
          prevNode.__width !== this.__width ||
          prevNode.__height !== this.__height
        ) {
          const img = dom as HTMLImageElement;
          img.src = this.__src;
          img.alt = this.__altText;
          img.style.maxWidth = `${this.__maxWidth}px`;
          img.style.width = this.__width === 'inherit' ? 'inherit' : `${this.__width}px`;
          img.style.height = this.__height === 'inherit' ? 'inherit' : `${this.__height}px`;
          return true;
        }
        return false;
      }

    exportDOM() : DOMExportOutput{
        const image = document.createElement('img');
        image.setAttribute('src', this.__src);
        image.setAttribute('alt', this.__altText);
        image.setAttribute('style', `max-width: ${this.__maxWidth}; width: ${this.__width}; height: ${this.__height};`);
        return {
            element: image,
        };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: (node: Node) => {
                return {conversion : convertImageElement, priority: 0};
            }
        };
    }

}