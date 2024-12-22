"use client";
import CardContainer from "@/Components/CardContainer";

import { ApolloProvider } from "@apollo/client";
import client from "@/ApiCalls/ApolloClient";

export default function Home() {
  return (
    <>
      <div>
        {/* <CardContainer /> */}
        <ApolloProvider client={client}>
          <div className=" sm:mx-[50px] sm:p-2 md:p-10 md:mx-[50px] rounded-2xl bg-[#2a7180]">
            <CardContainer />
          </div>
        </ApolloProvider>
      </div>
    </>
  );
}
