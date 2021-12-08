import type { NextPage } from 'next';
import 'tailwindcss/tailwind.css';
import { Links } from '../components/Links';

type PropsData = {
  url: string;
  text: string;
};

const Home: NextPage = () => {
  const propsData: PropsData[] = [
    {
      url: 'wine',
      text: 'ワイン',
    },
    {
      url: 'whisky',
      text: 'ウイスキー',
    },
  ];

  return <Links height='h-1/3' propsData={propsData} />;
};

export default Home;
