// Externals
import React, { ReactNode, FC, useLayoutEffect, useState } from "react";

export type InfiniteScrollProps = {
  elementArray: any[];
  children?: ReactNode | ReactNode[];
};

const InfiniteScroll: FC<InfiniteScrollProps> = ({
  children,
  elementArray,
}) => {
  let [dynamicArray, setDynamicArray] = useState<any[]>([]);

  let currentScroll = 1,
    throttleTimer;

  const scrollLimit = elementArray.length;
  const itemsPerScroll = 10;
  const scrollCount = Math.ceil(scrollLimit / itemsPerScroll);

  const throttle = (_callback: any, _timeout: any) => {
    if (throttleTimer) return;

    throttleTimer = true;

    setTimeout(() => {
      _callback();
      throttleTimer = false;
    }, _timeout);
  };

  const appendChild = (i: number) => {
    const outerScrollContainer: any = document.getElementById(
      "outer-scroll-container"
    );
    const card: any = document.createElement("div");
    card.className = "card";
    card.innerHTML = i;
    card.value = "test text";
    card.style.backgroundColor = "black";
    card.style.color = "white";
    card.style.borderRadius = "3rem";
    card.style.margin = "12px";
    card.style.width = "20px";

    outerScrollContainer.appendChild(card);
  };

  const showMore = (scrollIndex: number) => {
    currentScroll = scrollIndex;

    const startRange = (scrollIndex - 1) * itemsPerScroll;
    const endRange =
      currentScroll === scrollCount
        ? scrollLimit
        : scrollIndex * itemsPerScroll;

    for (let i = startRange + 1; i <= endRange; i++) {
      if (i !== scrollLimit) appendChild(i);
    }
  };

  const handleInfiniteScroll = () => {
    const timeout = 1_000; // 1 second throttle

    throttle(() => {
      const endOfPage =
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
      if (endOfPage) showMore(currentScroll + 1);
      if (currentScroll === scrollCount) removeInfiniteScroll();
    }, timeout);
  };

  const removeInfiniteScroll = () => {
    const innerScrollContainer: any = document.getElementById(
      "inner-scroll-container"
    );
    innerScrollContainer.remove();
    window.removeEventListener("scroll", handleInfiniteScroll);
  };

  useLayoutEffect(() => {
    showMore(currentScroll);
  }, []);

  window.addEventListener("scroll", handleInfiniteScroll);

  return (
    <>
      <div id="outer-scroll-container"></div>
    </>
  );
};

export default InfiniteScroll;
