import MailToComposer from "./components/mailto-composer";

function App() {
  return (
    <div className="flex flex-col items-center gap-4 p-20 w-full">
      <h1 className="font-bold text-3xl">Mailto Composer</h1>
      <MailToComposer />
    </div>
  );
}

export default App;
