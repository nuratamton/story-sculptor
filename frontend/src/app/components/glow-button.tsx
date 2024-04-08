import { css, keyframes } from "@emotion/react";
import { forwardRef } from "react";
import { Button } from "@chakra-ui/react";

const glowingAnimation = keyframes`
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
`;

const GlowButton = forwardRef(({ children, ...props }: any, ref) => {
  return (
    <Button
      ref={ref}
      {...props}
      css={css`
        position: relative;
        z-index: 0;
        border-radius: 10px;
        outline: none;
        border: none;
        cursor: pointer;

        &:before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          background: linear-gradient(
            45deg,
            #ff0000,
            #ff7300,
            #fffb00,
            #48ff00,
            #00ffd5,
            #002bff,
            #7a00ff,
            #ff00c8,
            #ff0000
          );
          background-size: 400%;
          z-index: -1;
          filter: blur(5px);
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          animation: ${glowingAnimation} 20s linear infinite;
        }

        &:hover:before {
          opacity: 1;
        }

        &:active {
          color: #000;
        }

        &:active:after {
          background: transparent;
        }
      `}
    >
      {children}
    </Button>
  );
});

export default GlowButton;
