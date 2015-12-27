
import Action from '../Flux/Action';
import action from '../Socket/action';

@action('demo.changeStatus')
export class ChangeStatus extends Action<{}> {}
