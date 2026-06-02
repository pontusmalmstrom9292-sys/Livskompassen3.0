import { TimeAndPayPanel } from './TimeAndPayPanel';

type Props = {
  userId: string;
};

/** Tid & stämpel för Vardagshubben — `userId` reserverad för framtida scoped queries. */
export function TimeSheetPanel({ userId: _userId }: Props) {
  return <TimeAndPayPanel />;
}
