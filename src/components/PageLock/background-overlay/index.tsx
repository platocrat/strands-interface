const PageLockBackgroundOverlay = ({ hasFirst100NFT }) => {
  return (
    <>
      <div
        style={{
          display: hasFirst100NFT ? "none" : "flex",
          backgroundColor: "transparent",
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: "10",
          opacity: "0.5",
          backdropFilter: "blur(50px)",
        }}
      />
      <div
        style={{
          display: hasFirst100NFT ? "none" : "flex",
          backgroundColor: "transparent",
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: "10",
          opacity: "0.5",
          backdropFilter: "blur(50px)",
        }}
      />
    </>
  );
};

export default PageLockBackgroundOverlay;
