import { Image, Result, Statistic } from "antd";
import { FaRegClock } from "react-icons/fa6";

const Response = () => {
  const paymentStatus = true;
  const moneyData = { requested: 10000000, funded: 7000000, spent: 10000000 };
  const spare = moneyData.funded - moneyData.spent;
  return (
    <>
      {/* <div className="w-[35%] justify-center text-center place-items-center ">
      <Result className="place-items-center"
        icon={
          <FaRegClock
            size={150}
            className="items-center place-item-center text-center"
          />
        }
        title="Please wait for confirming"
      />
    </div> */}
      <div className="w-[35%]">
        {paymentStatus === false ? (
          <>
            {" "}
            <div className="pt-5">
              <div className="flex justify-around">
                <Statistic
                  value={moneyData.requested}
                  className="w-[50%] "
                  title="Requested (VND)"
                />
                <Statistic
                  value={moneyData.funded}
                  className="w-[50%]"
                  title="Funded (VND)"
                />
              </div>
              <div className="flex justify-around pt-2">
                <Statistic
                  value={moneyData.spent}
                  className="w-[50%] "
                  title="Spent (VND)"
                />
                <Statistic
                  value={spare}
                  className="w-[50%]"
                  valueStyle={{
                    color: spare > 0 ? "red" : "green",
                  }}
                  title="Spare (VND)"
                />
              </div>
            </div>
            <div className="pt-4 text-base">
              {spare > 0 ? (
                <>
                  <div className="text-center">
                    <div>You have an excess amount of money.</div>
                    <div>Please return the spare amount of </div>
                    <span>
                      <Statistic value={spare} suffix=" VND" />
                    </span>
                  </div>{" "}
                  <div className="text-center">
                    <Image
                      width={200}
                      height={200}
                      className="object-contain "
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                      }
                    />
                    <p>scan here</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div>You have overused funds.</div>
                    <div>The school will reimburse you the amount of</div>
                    <span>
                      <Statistic
                        value={
                          spare + moneyData.funded > moneyData.requested
                            ? moneyData.requested - moneyData.funded
                            : spare * -1
                        }
                        suffix=" VND"
                      />
                    </span>
                  </div>{" "}
                  <div className="text-start pt-4">
                    <div>Please check your account: </div>
                    <div>
                      <span className="text-gray-500 text-sm">
                        Account Name:
                      </span>{" "}
                      <span>TRAN VAN A</span>{" "}
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">
                        Account Number
                      </span>{" "}
                      <span>*******123</span>{" "}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <Result
            title="Payment succes"
            status="success"
          />
        )}
      </div>
    </>
  );
};
export default Response;
