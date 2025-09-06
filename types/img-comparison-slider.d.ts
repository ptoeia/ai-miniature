declare namespace JSX {
  interface IntrinsicElements {
    'img-comparison-slider': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: string;
        hover?: string;
        direction?: 'horizontal' | 'vertical';
        keyboard?: string;
        handle?: string;
        nonce?: string;
      },
      HTMLElement
    >;
  }
} 