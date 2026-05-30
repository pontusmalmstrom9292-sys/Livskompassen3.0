import { clsx } from 'clsx';

export type DrawerL2HubId =
  | 'hem'
  | 'dagbok'
  | 'vardagen'
  | 'mabra'
  | 'familjen'
  | 'planering'
  | 'arbetsliv'
  | 'hamn'
  | 'projekt'
  | 'drogfrihet'
  | 'installningar';

type Props = {
  hubId: DrawerL2HubId;
  className?: string;
};

export function DrawerL2Icon({ hubId, className }: Props) {
  return (
    <img
      src={`/icons/drawer-l2/drawer-${hubId}.svg`}
      className={clsx('drawer-l2-icon shrink-0 object-contain', className)}
      alt=""
      aria-hidden
      decoding="async"
      draggable={false}
    />
  );
}

export function createDrawerL2Icon(hubId: DrawerL2HubId) {
  return function DrawerL2IconSlot({
    className,
    strokeWidth: _strokeWidth,
  }: {
    className?: string;
    strokeWidth?: number;
  }) {
    return <DrawerL2Icon hubId={hubId} className={className} />;
  };
}
