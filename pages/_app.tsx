import LayoutMain from '@/src/components/layout/layout';
import './global.css';

import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <LayoutMain>
            <Component {...pageProps} />
        </LayoutMain>
    )
}

export default MyApp;