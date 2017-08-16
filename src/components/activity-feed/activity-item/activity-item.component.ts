import { Component, Input } from '@angular/core';

import * as _ from 'lodash';

// import {
//   ContractPreviewModalComponent,
//   ContractPreviewModalContext
// } from '../../../+contracts/contract-preview/contract-preview-modal/contract-preview-modal.component';
// import { StickyButtonsModal } from '../../../sq-modal/base-modal-components/sticky-buttons/sticky-buttons-modal.service';
import { ContractService } from '../../../services/contract/contract.service';

@Component({
  selector: 'activity-item',
  templateUrl: 'activity-item.component.html'
})
export class ActivityItemComponent {
  @Input() item: any;
  @Input() showTargetMeta: boolean;

  constructor(
    public contractService: ContractService
  ) {
  }

  public ngOnInit() {
  }

  onClickActivity(target, item, type) {

  }

  previewContract(contractId, canSign: boolean = true) {
    // this.contractService.mySignature(contractId).subscribe(signature => {
    //   this.buttonsModal
    //     .open(ContractPreviewModalComponent,
    //       overlayConfigFactory({
    //         isBlocking: false,
    //         canSign: canSign,
    //         showFooter: canSign,
    //         contractId: contractId,
    //         signature: signature
    //       }, ContractPreviewModalContext)
    //     );
    // });
  }

  getIcon(action) {
    let iconClass = 'ios-document-outline';

    if (_.includes(action, 'invoice') || _.includes(action, 'payment'))
      return 'logo-usd';

    if (_.includes(action, 'contract'))
      return 'ios-document-outline';

    if (_.includes(action, 'job'))
      return 'ios-document-outline';

    if (_.includes(action, 'proposal'))
      return 'ios-document-outline';

    if (_.includes(action, 'event'))
      return 'ios-calendar-outline';

    return iconClass;
  }

  getIconColor(action) {
    let iconClass = 'icon-normal';

    if (_.includes(action, 'invoice') || _.includes(action, 'payment'))
      return 'icon-money';

    if (_.includes(action, 'contract'))
      return 'icon-blue';

    if (_.includes(action, 'proposal'))
      return 'icon-yellow';
    return iconClass;
  }
}
