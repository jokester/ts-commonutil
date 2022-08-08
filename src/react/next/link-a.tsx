import Link from 'next/link';
import React, { AnchorHTMLAttributes } from 'react';

export const LinkA: React.FC<{ isExternal?: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  const { href, children, isExternal, ...rest } = props;
  return (
    <Link href={props.href!} passHref>
      <a href={props.href} {...rest}>
        {children}
      </a>
    </Link>
  );
};
