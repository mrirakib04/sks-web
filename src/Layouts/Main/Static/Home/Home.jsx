import { HeadProvider, Title } from "react-head";
import HomeBanner from "./HomeComponents/HomeBanner";
import HomeProducts from "./HomeComponents/HomeProducts";

const Home = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <HeadProvider>
        <Title>Sinthia Kitchen Shop</Title>
      </HeadProvider>
      <HomeBanner></HomeBanner>
      <HomeProducts></HomeProducts>
    </div>
  );
};

export default Home;
