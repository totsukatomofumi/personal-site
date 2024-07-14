function Grid({ boxComponent }) {
  return (
    <div className="w-fit h-full flex flex-col gap-3 scroll-trigger">
      {Array(3).fill(
        <div className="h-[calc((100%-2*0.75rem)/3)] flex flex-row gap-3">
          {Array(7).fill(boxComponent)}
        </div>
      )}
    </div>
  );
}

export default Grid;
