import { Component, Input } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConstantProvider} from '../../providers/constant/constant';
// service
import { SessionStorageProvider } from "../../providers/session-storage/session-storage";

/**
 * 门诊 药物信息 和 住院 医嘱
 */
@Component({
  selector: 'uv-drug',
  templateUrl: 'uv-drug.html'
})
export class UvDrugComponent {
  // 当前组件所属范围 住院、门诊
  // 2 门诊； 3 住院
  // 这里决定了下方的获取数据方法的 url
  @Input() type
  @Input() xlData

  // 渲染用数据
  renderData

  constructor(
    public Http:HttpClient,
    public Constant:ConstantProvider,
    public ss: SessionStorageProvider,
  ) {
  }

  ngOnInit() {
    this.getData(this.type)
  }

  /**
   * 获取数据
   */
  getData(type) {
    var url: string = ''
    var dataType = null

    var xlPatientId = this.xlData.xlPatientId
    var xlMedicalId = this.xlData.xlMedicalId

    switch(type) {
      case 2:
        dataType = 51
        break
      case 3:
        dataType = 43
        break
    }

    url = `${this.Constant.BackstageUrl_unitView}/unite/resource/single/${dataType}?filter__xlPatientId=${xlPatientId}&filter__xlMedicalId=${xlMedicalId}`

    this.Http.get(url)
      .subscribe({
        next: (msg) => {
          if(msg['status'] === 'ok') this.renderData = msg['data']['result']
          else if(msg['status'] === 'blank') this.renderData = []
          else {
            this.renderData = 'err'
          }
        },
        error: (error) => {
          this.renderData = 'err'
        }
      })
  }

  /**
   * 点击查看更多
   */
  collapse(event) {
    if(event.target.className.indexOf('more') >= 0) {
      let parentEle = event.target.parentElement

      var classes = parentEle.className.split(" ");
      var i = classes.indexOf("active");

      if(event.target.dataset.collapse == 'close') {
        event.target.dataset.collapse = 'open'
        event.target.innerText = '收起↑'
        classes.push("active");
      } else {
        event.target.dataset.collapse = 'close'
        event.target.innerText = '更多↓'
        classes.splice(i, 1);
      }

      parentEle.className = classes.join(" ");
    }
  }

}
