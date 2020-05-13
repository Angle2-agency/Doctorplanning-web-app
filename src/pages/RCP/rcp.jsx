import React from 'react'
import Layout from '../../components/Layout'
import { Table } from 'antd'
import bgArticleSrc from '../../assets/images/bg-owl-eye.png'

import './rcp.css'

const dataSourceTable1 = [
  {
    key: '1',
    composition: 'Lysine',
    quantity: '25g',
  },
  {
    key: '2',
    composition: 'Arginine',
    quantity: '25g',
  },
  {
    key: '3',
    composition: 'Chlorure de sodium 9 mg/mL (0,9 %) solution pour injection',
    quantity: '1 L',
  },
]

const columnsTable1 = [
  {
    title: 'Composition',
    dataIndex: 'composition',
  },
  {
    title: 'Quantité',
    dataIndex: 'quantity',
  },
]

const dataSourceTable2 = [
  {
    key: '1',
    priority: 'Teneur en lysine',
    specification: 'Entre 18 et 24 g',
  },
  {
    key: '2',
    priority: 'Teneur en arginine',
    specification: 'Entre 18 et 24 g',
  },
  {
    key: '3',
    priority: 'Volume',
    specification: '1,5 L à 2,2 L',
  },
  {
    key: '4',
    priority: 'Osmolarité',
    specification: '< 1 050 mOsmol/L',
  },
]

const columnsTable2 = [
  {
    title: 'Propriété',
    dataIndex: 'priority',
  },
  {
    title: 'Spécification',
    dataIndex: 'specification',
  },
]
const dataSourceTable3 = [
  {
    key: '1',
    criteria: 'Insuffisance cardiaque sévère (définie comme étant de grade III ou IV de la classification NYHA)',
  },
  {
    key: '2',
    criteria: 'Grossesse',
  },
  {
    key: '3',
    criteria: 'Hypersensibilité au principe actif ou à l’un des excipients de ce médicament',
  },
  {
    key: '4',
    criteria:
      'Si des réactions indésirables spécifiques persistent ou réapparaissent, comme l’hématotoxicité retardée de grade 3-4 (G3-G4) (voir Tableau 5).',
  },
]

const columnsTable3 = [
  {
    title:
      'Arrêter les administrations de Lutathera chez les patients qui ont présenté ou sont à risque de présenter les affections suivantes pendant le traitement:',
    dataIndex: 'criteria',
  },
]
const dataSourceTable4 = [
  {
    key: '1',
    criteria:
      'Apparition d’une pathologie intercurrente (p.ex. infections urinaires) qui, selon l’avis du médecin, pourrait augmenter les risques associés à l’administration de Lutathera.',
    action:
      'Suspendre le traitement jusqu’à résolution ou stabilisation de la pathologie. Le traitement peut être repris dès résolution ou stabilisation.',
  },
  {
    key: '2',
    criteria: 'Opération chirurgicale majeure',
    action: 'Attendre 12 semaines après la date de l’opération pour administrer Lutathera',
  },
  {
    key: '3',
    criteria: 'Réactions indésirables majeures ou certaines réactions indésirables spécifiques à Lutathera',
    action: 'Voir Tableau 5',
  },
]

const columnsTable4 = [
  {
    title: 'Critère',
    dataIndex: 'criteria',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  },
]
export default function() {
  return (
    <Layout title="RCP" type="no-sidebar">
      <article className="article">
        <img src={bgArticleSrc} className="article__bg-image" alt="Information cliniques" />
        <div className="article__inner">
          <h5 className="h-5 text-upper">Information cliniques</h5>
          <div className="article__block">
            <h5 className="h-5">Indications thérapeutiques</h5>
            <p>
              Lutathera est indiqué pour le traitement des tumeurs neuroendocrines gastroentéropancréatiques (TNE -GEP)
              inopérables ou métastatiques, progressives, bien différenciées (G1 et G2) et exprimant des récepteurs de
              somatostatine chez les adultes.
            </p>
          </div>
          <div className="article__block">
            <h5 className="h-5">Posologie et mode d’administration</h5>
            <p>
              Lutathera ne doit être administré que par des personnes autorisées à manipuler des produits
              radiopharmaceutiques dans un environnement clinique agréé (voir la rubrique 6.6) et après une évaluation
              du patient par un médecin qualifié. Avant de débuter le traitement par Lutathera, une imagerie des
              récepteurs de la somatostatine (scintigraphie ou tomographie par émission de positons [TEP]) doit
              confirmer la surexpression de ces récepteurs dans les tissus tumoraux avec une fixation tumorale au moins
              aussi élevée que la fixation hépatique normale (fixation tumorale ≥ 2).
            </p>
          </div>
          <div className="article__block">
            <p className="mb-2">Posologie</p>
            <p className="text-italic">Adultes</p>
            <p>
              La posologie de Lutathera recommandée chez l’adulte est de 4 perfusions de 7 400 MBq chacune. L’intervalle
              de temps recommandé entre chaque administration est de 8 semaines et il peut être étendu jusqu’à 16
              semaines en cas de toxicité modifiant la dose (TMD) (voir Tableau 5). Afin de protéger la fonction rénale,
              une solution d’acides aminés doit être administrée par voie intraveineuse pendant 4 heures. La perfusion
              de la solution d’acides aminés doit être initiée 30 minutes avant de commencer la perfusion de Lutathera.
            </p>
          </div>
          <div className="article__block">
            <p className="text-italic">
              Solution d’acides aminés <br />
              La solution d’acides aminés peut être préparée selon la composition spécifiée dans le Tableau 1 en
              conformité avec les bonnes pratiques de préparation des produits stériles à l’hôpital.
            </p>
          </div>
          <div className="article__block">
            <h5 className="h-5">Tableau 1. Composition de la solution d’acides aminés préparée</h5>
            <Table dataSource={dataSourceTable1} columns={columnsTable1} pagination={false} />
          </div>
          <div className="article__block">
            <p>
              Alternativement, certaines solutions commerciales d’acides aminés peuvent être utilisées si elles
              respectent les spécifications indiquées dans le Tableau 2.
            </p>
          </div>
          <div className="article__block">
            <h5 className="h-5">Tableau 2. Spécification des solutions commerciales d’acides aminés</h5>
            <Table dataSource={dataSourceTable2} columns={columnsTable2} pagination={false} />
          </div>
          <div className="article__block">
            <p>
              Compte tenu de la quantité élevée d’acides aminés et du volume élevé que les solutions commerciales
              disponibles peuvent nécessiter pour satisfaire aux spécifications, la solution préparée est considérée
              comme le produit de choix du fait de son volume à perfuser plus restreint et de sa plus faible osmolarité
            </p>
          </div>
          <div className="article__block">
            <p>Suivi du traitement</p>
            <p>
              Avant chaque administration et pendant le traitement, des analyses biologiques sont requises pour
              réévaluer l’état du patient et adapter le protocole thérapeutique si nécessaire (activité, intervalle
              entre les perfusions, nombre de perfusions).
            </p>
          </div>
          <div className="article__block">
            <p>Les analyses biologiques minimales à réaliser avant chaque perfusion sont:</p>
            <ul className="mt-2 list-dotted">
              <li>
                fonction hépatique (alanine aminotranférase [ALAT], aspartate aminotranférase [ASAT], albumine,
                bilirubine);
              </li>
              <li>fonction rénale (créatinine et estimation de la clairance de la créatinine);</li>
              <li>hématologie (hémoglobine [Hb], numération différenciée des leucocytes, nombre de plaquettes).</li>
            </ul>
          </div>
          <div className="article__block">
            <p>
              Ces analyses doivent être effectuées au moins une fois 2 à 4 semaines avant l’administration et une fois
              juste avant l’administration. Il est aussi recommandé d’effectuer ces analyses toutes les 4 semaines
              pendant au moins 3 mois après la dernière perfusion de Lutathera et ensuite tous les 6 mois afin de
              pouvoir détecter des effets indésirables tardifs potentiels (voir rubrique 4.8). La posologie peut être
              modifiée si nécessaire selon les résultats des analyses.
            </p>
          </div>
          <div className="article__block">
            <p>Modification de traitement</p>
            <p>
              Dans certaines circonstances, il peut être nécessaire d’arrêter temporairement le traitement par
              Lutathera, d’adapter l’activité après une première administration ou même d’arrêter le traitement (voir
              les tableaux 3 et 5 et Figure 1).
            </p>
          </div>
          <div className="article__block">
            <h5 className="h-5">Tableau 3. Critères d’interruption définitive du traitement par Lutathera</h5>
            <Table dataSource={dataSourceTable3} columns={columnsTable3} pagination={false} />
          </div>
          <div className="article__block">
            <h5 className="h-5">Tableau 4. Critères d’arrêt temporaire du traitement par Lutathera</h5>
            <Table dataSource={dataSourceTable4} columns={columnsTable4} pagination={false} />
          </div>
        </div>
      </article>
    </Layout>
  )
}
