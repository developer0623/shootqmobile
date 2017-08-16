import { ItemTemplate } from './item-template';


export class PackageTemplateItem {
  id?: number; /* Virtual */
  created?: Date;
  modified?: Date;
  quantity: number;
  item_template: number; /*(required)*/
  item_template_data?: ItemTemplate;
  package_template?: number; /*(required)*/
  addons_price?: number | string;
}
