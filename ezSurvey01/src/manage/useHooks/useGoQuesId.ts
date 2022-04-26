
export default function useGoQuesId(initOptions = { block: "start" }) {

  const goQuesId = (quesid, options = {}) => {
    const quest = $(`.question[data-quesid='${quesid}']`)[0];
    const clientTop = quest && quest.getBoundingClientRect().top || 0;
    const clientHeight = window.innerHeight * 3 / 4;

    if (clientTop < 0 || clientTop >= clientHeight) {
      const headerOffset = 35;
      const offsetTop = $(quest).offset().top - headerOffset;
      window.scrollTo({ top: offsetTop });
    }

    return quest;
  }

  return { goQuesId };
}
