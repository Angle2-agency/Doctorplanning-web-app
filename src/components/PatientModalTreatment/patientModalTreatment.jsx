import React from 'react'
import { Modal, Button, Input, DatePicker, TimePicker, Checkbox } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { handleRenderDatePicker } from '../../helpers'
import Icon from '../../elements/Icon'
import successCalendar from '../../assets/images/success-calendar.svg'
import cautionIcon from '../../assets/images/caution.svg'
import { MIN_REPLANNIG_CRITICAL_PERIOD } from '../../core/constants'

const Textarea = Input.TextArea

export default function() {
  const { status, startTime, endTime, dosis, patient } = this.state.data[0]
  const stepDefault = (
    <div>
      <div className="flex-center">
        <div className={`mdl-status-icon ${status}`}>
          <div className="mdl-status-icon__inner">
            <Icon name="injection" />
          </div>
        </div>
        <div className="ml-3">
          <h3 className="h-3">{dosis ? `D’njection №${dosis}` : 'Biotest'}</h3>
          <p className="mt-1 lightgrey">
            Pour{' '}
            {this.state.userMode === 'patient' ? (
              this.props.user.name
            ) : (
              <span>
                {patient.firstName} {patient.lastName}
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="divider-horz"></div>
      {this.state.userMode === 'patient' ? <h4 className="h-4">Votre prochaine injection aura lieu le:</h4> : null}
      <div className="flex-center mt-2 fz-16">
        <Icon name="calendar" />
        <div className="mdl__date-bar ml-2">
          {this.state.editEnabled ? (
            <div className={`edit-table-timestamp ${this.state.editEnabled ? 'is-active' : ''}`}>
              <DatePicker
                style={{ width: 110 }}
                defaultValue={moment(+startTime)
                  .hours(0)
                  .minutes(0)}
                format="LL"
                mode="date"
                dropdownClassName="calendar-styled"
                dateRender={(currentDate, today) => handleRenderDatePicker(currentDate, today, this.props.events)}
                disabled={!this.state.editEnabled}
                suffixIcon={false}
                allowClear={false}
                showToday={false}
                onChange={e => this.handleDateTimeChange(e, this.state.data[0], 0, 'startTime')}
              />
              <TimePicker
                defaultValue={moment(+startTime)}
                use12Hours
                format="h:mm a"
                minuteStep={15}
                suffixIcon={<br />}
                allowClear={false}
                style={{ width: 85 }}
                disabled={!this.state.editEnabled}
                onChange={e => this.handleDateTimeChange(e, this.state.data[0], 0, 'startTime', 'onlyHoursMins')}
              />
              <span> — </span>
              <TimePicker
                defaultValue={moment(+endTime)}
                use12Hours
                format="h:mm a"
                minuteStep={15}
                disabledHours={() => [1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24]}
                suffixIcon={<br />}
                allowClear={false}
                style={{ width: 85 }}
                disabled={!this.state.editEnabled}
                onChange={e => this.handleDateTimeChange(e, this.state.data[0], 0, 'endTime', 'onlyHoursMins')}
              />
            </div>
          ) : (
            <div className="flex-center">
              {moment(+startTime).format('LL')} | {moment(+startTime).format('h:mm a')} —
              {moment(+endTime).format('h:mm a')}
            </div>
          )}
          {this.state.userMode === 'hcp' ? (
            <Button className="transparent p-0" onClick={this.handleEditEnabled}>
              <Icon name="edit" />
              <span>{this.state.editEnabled ? 'Annuler' : 'Replanifier'}</span>
            </Button>
          ) : null}
        </div>
      </div>
      {this.state.userMode === 'hcp' ? (
        <div>
          <div className="mt-5">
            {dosis || status === 'waiting' ? (
              <div className="mt-1">
                <Checkbox
                  onChange={this.handleConfirmationDoctor}
                  disabled={!this.state.editEnabled}
                  checked={this.state.confirmationDoctor}
                >
                  {this.state.doctorName} approuve {dosis ? `l’njection №${dosis}` : 'biotest'}
                </Checkbox>
              </div>
            ) : null}
            {status === 'confirmed' || status === 'waiting' ? (
              <div className="mt-1">
                <Checkbox
                  onChange={this.handleConfirmationDuAAA}
                  disabled={!this.state.editEnabled}
                  checked={this.state.confirmationDuAAA}
                >
                  Confirmation du AAA
                </Checkbox>
              </div>
            ) : null}
            {status === 'critical' ? (
              <div className="mt-3" style={{ width: '100%' }}>
                <div className="textarea-head">
                  <span className="fz-16">
                    {this.state.userMode === 'patient' ? (
                      this.props.user.name
                    ) : (
                      <span>
                        {patient.firstName} {patient.lastName}
                      </span>
                    )}
                  </span>
                  <div className="textarea-head__time lightgrey">
                    Lun, {moment(+startTime).format('LL')} <br />
                    {moment(+startTime).format('h:mm')}-{moment(+endTime).format('h:mm')}
                  </div>
                </div>
                <Textarea
                  value="Docteur, Je me sens vraiment mal, pouvons-nous déplacer l'injection à venir ? Vous pouvez choisir la date qui vous convient le mieux.
              Dans l'attente de votre retour, Merci beaucoup"
                  onChange={this.handleMessageChange}
                  style={{ width: '100%', minHeight: 113 }}
                />
              </div>
            ) : null}
          </div>
          <p className="mt-2 lightgrey">Le patient recevra une notification immédiate</p>
          <div className="mt-5 flex-center justify-content-end">
            {this.state.dataChanged ? (
              <Button className="green md" onClick={this.handleValidateOrCancel}>
                <span>Sauvegarder</span>
              </Button>
            ) : (
              <Button className="white md" onClick={this.handleCancel}>
                <span>Retour</span>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 flex-center justify-content-end">
          <Button className="transparent" onClick={this.handleCancel}>
            <span className="underlined">Retour au calendrier</span>
          </Button>
          <Button className="green" onClick={this.handleGoStepMessage}>
            <span>Replanifier</span>
          </Button>
        </div>
      )}
    </div>
  )
  const criticalExceptionCase = (
    <div className="modal-confirm__body">
      <h3 className="h-3 mt-3">
        La prise de commande doit se faire dans un délai de {moment.duration(+MIN_REPLANNIG_CRITICAL_PERIOD).days()}{' '}
        jours avant la date d&apos;injection
      </h3>
      <p className="mt-3">Merci de vérifier auprès de AAA la possibilité de prise de commande</p>
      <div className="mt-5 text-center">
        <Button className="green" onClick={this.handleCriticalExceptionCaseWarning}>
          <span>J’ai confirmation par le fabricant</span>
        </Button>
        <div className="mt-2">
          <Button className="transparent" onClick={this.handleGoStepConfirm}>
            <span className="underlined">Garder le statut critique</span>
          </Button>
        </div>
        <div className="mt-1">
          <Button className="transparent" onClick={this.handleGoStepDefault}>
            <span className="underlined">Sélectionnez une autre date</span>
          </Button>
        </div>
      </div>
    </div>
  )
  const criticalExceptionCaseWarning = (
    <div className="modal-confirm__body">
      <h3 className="h-3 mt-3">
        Vous devriez reprogrammer l&apos;injection N°{dosis} pour{' '}
        {this.state.userMode === 'patient' ? (
          this.props.user.name
        ) : (
          <span>
            {patient.firstName} {patient.lastName}
          </span>
        )}
      </h3>
      <p className="mt-3">Merci de vérifier auprès de AAA la possibilité de prise de commande</p>
      <div className="mt-5 text-center">
        <Button className="green" onClick={this.handleGoStepConfirm}>
          <span>Garder le statut critique</span>
        </Button>
        <div className="mt-1">
          <Button className="transparent" onClick={this.handleGoStepDefault}>
            <span className="underlined">Сhanger de date</span>
          </Button>
        </div>
      </div>
    </div>
  )
  const stepMessageLayout = (
    <div>
      <div className="modal-confirm__head">
        <img src={cautionIcon} alt="caution" />
      </div>
      {this.state.userMode === 'hcp' ? (
        this.state.criticalExceptionCase ? (
          this.state.criticalExceptionCaseWarning ? (
            criticalExceptionCaseWarning
          ) : (
            criticalExceptionCase
          )
        ) : null
      ) : (
        <div>
          <div className="modal-confirm__body">
            <h3 className="h-3 mt-3">Êtes-vous sûr.e de vouloir replanifier l&apos;injection ?</h3>
            <p className="mt-3">Veuillez expliquer les raisons de cette replanification</p>
            <div className="mt-3" style={{ width: '100%' }}>
              <Textarea
                placeholder="Taper votre explication ici..."
                onChange={this.handleMessageChange}
                style={{ width: '100%', minHeight: 113 }}
              />
            </div>
          </div>
          <div className="mt-5 flex-center justify-content-end">
            <Button className="transparent md" onClick={this.handleCancel}>
              <span className="underlined">Annuler</span>
            </Button>
            <Button className={this.state.messageValue ? 'green' : 'disabled'} onClick={this.handleGoStepConfirm}>
              <span>Confirmer la demande</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
  const stepConfirm = (
    <div>
      <div className="modal-confirm__head">
        <img src={successCalendar} alt="caution" />
      </div>
      {this.state.userMode === 'hcp' ? (
        <div className="modal-confirm__body">
          <p className="mt-3">
            {this.props.user.name} a replanifié Le {dosis ? `l’njection №${dosis}` : 'biotest'}
          </p>
          <h3 className="h-3 mt-3">
            {patient.firstName} {patient.lastName}
          </h3>
          <div className="mt-5 d-flex justify-content-center">
            <Link to="#" className="link-highlighted">
              Télécharger le bon de commande
            </Link>
          </div>
        </div>
      ) : (
        <div className="modal-confirm__body">
          <h3 className="h-3 mt-3">
            Demande de replanification {dosis ? `l’njection №${dosis}` : 'biotest'} envoyée avec succès
          </h3>
          <p className="mt-3">Le système gardera le statut critique jusqu&apos;à confirmation par votre médecin</p>
        </div>
      )}

      <div className="flex-center justify-content-center mt-3">
        <Button className="green md" onClick={this.handleCancel}>
          <span>Ok</span>
        </Button>
      </div>
    </div>
  )
  return (
    <Modal
      centered
      width={560}
      footer={null}
      visible={this.props.visible}
      onCancel={this.handleCancel}
      afterClose={this.handleAfterClose}
    >
      {this.state.stepMessage ? stepMessageLayout : this.state.stepConfirm ? stepConfirm : stepDefault}
    </Modal>
  )
}
