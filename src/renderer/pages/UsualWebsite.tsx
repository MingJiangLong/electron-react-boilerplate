import { FloatButton } from "antd";

export default function () {
  return (
    <div style={{ height: '100%', width: '100%', margin: 0, padding: 0 }}>
      <iframe
        style={{
          width: '100%',
          height: '100%',
        }}
        src="http://www.bing.com"
      ></iframe>
      <FloatButton onClick={() => console.log('onClick')} />
    </div>
  );
}
