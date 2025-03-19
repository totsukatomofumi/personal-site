import {
  ATTRIBUTIONS,
  EMAIL,
  FINAL_NOTE,
  GITHUB,
  KAGGLE,
  LINKEDIN,
} from "../constants";
import uiMenuBase from "../sprites/ui-menu-base.png";

function MenuCredits() {
  return (
    <>
      <div className="absolute w-full h-fit top-[50px] z-50 px-[26.5px] text-xs text-left font-synemono text-custom-off-white whitespace-pre-line leading-snug">
        <div>
          <p>{FINAL_NOTE}</p>
        </div>
        <br />
        <div className="w-full h-fit flex flex-row justify-center items-center gap-5 text-custom-white">
          <a href={LINKEDIN} target="_blank" rel="noreferrer">
            <i class="fa-brands fa-linkedin fa-2x"></i>
          </a>
          <a href={GITHUB} target="_blank" rel="noreferrer">
            <i class="fa-brands fa-github fa-2x"></i>
          </a>
          <a href={KAGGLE} target="_blank" rel="noreferrer">
            <i class="fa-brands fa-kaggle fa-2x"></i>
          </a>
          <a href={`mailto:${EMAIL}`} target="_blank" rel="noreferrer">
            <i class="fa-solid fa-envelope fa-2x"></i>
          </a>
        </div>
        <div className="relative top-7">
          <p className="text-custom-gold">Attributions:</p>
          <div className="text-[10px]">
            {ATTRIBUTIONS.map((attr, key) => {
              return (
                <p key={key}>
                  {"- "}
                  <a
                    href={attr.title[1]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-custom-gold underline"
                  >
                    {attr.title[0]}
                  </a>{" "}
                  by{" "}
                  <a
                    href={attr.creator[1]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-custom-gold underline"
                  >
                    {attr.creator[0]}
                  </a>
                  , licensed under{" "}
                  <a
                    href={attr.license[1]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-custom-gold underline"
                  >
                    {attr.license[0]}
                  </a>
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-0 w-fit h-full">
        <img src={uiMenuBase} alt="ui-menu-base" className="h-full" />
      </div>
    </>
  );
}

export default MenuCredits;
