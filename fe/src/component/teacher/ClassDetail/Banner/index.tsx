import { Breadcrumb } from "antd";
interface Props {
  name: string;
  background?: string;
}
const Banner = ({
  name,
  background = "https://img.freepik.com/premium-photo/smooth-color-black-background_41969-15979.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1699488000&semt=ais",
}: Props) => {
  return (
    <div className="w-full p-5 bg-white">
      <Breadcrumb
        items={[
          {
            title: <a href="/classes">Classes</a>,
          },
          {
            title: <span className="text-primary">{name}</span>,
          },
        ]}
      />
      <div
        className="h-[257px] w-11/12 rounded-md bg-cover bg-center mx-auto mt-5 flex items-end p-3"
        style={{
          backgroundImage: `url('${background}')`,
        }}
      >
        <h1 className="text-white text-[32px] font-medium">{name}</h1>
      </div>
    </div>
  );
};
export default Banner;
