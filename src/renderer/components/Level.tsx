type LevelProps = {
  level: number;
  color?: string;
};
const taskLevelColor: Record<number, string> = {
  1: '#DD0000',
  2: '#ff9800',
  3: '#2098ee',
};

const SIZE = 23;
export default function (props: LevelProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: SIZE,
        height: SIZE,
        borderWidth: 2,
        borderColor: taskLevelColor[props.level] ?? '#FF9999',
        borderStyle: 'solid',
        borderRadius: SIZE,
        textAlign: 'center',
        margin: '0 5px',
        lineHeight: SIZE*.06,
      }}
    >
      {props.level}
    </span>
  );
}
