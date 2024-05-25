import * as React from 'react';

export type PropOf<T extends React.ComponentType<any>> = T extends React.ComponentType<infer P> ? P : unknown;
